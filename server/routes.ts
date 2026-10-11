import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { db, MenuItem } from './db.js';
import { authenticateAdmin, generateToken, loginRateLimiter, AuthenticatedRequest } from './auth.js';

export const apiRouter = express.Router();

// Multer setup for local file uploads
const uploadsDir = path.resolve(process.cwd(), 'uploads');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed.'));
    }
  },
});

// ==========================================
// 1. PUBLIC ROUTES
// ==========================================

// Get all available menu items for public site
apiRouter.get('/menu', (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    let items = db.getMenuItems(true); // only available

    if (category && category !== 'all') {
      items = items.filter(i => i.category === category);
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items.' });
  }
});

// Get all categories for public navigation
apiRouter.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = db.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

// Get site settings (contact info, hours, addresses, social links)
apiRouter.get('/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site settings.' });
  }
});

// Basic site statistics
apiRouter.get('/stats', (_req: Request, res: Response) => {
  const allItems = db.getMenuItems();
  const availableItems = allItems.filter(i => i.isAvailable);
  const featuredItems = allItems.filter(i => i.isFeatured);
  const categories = db.getCategories();

  res.json({
    totalItems: allItems.length,
    availableItems: availableItems.length,
    featuredItems: featuredItems.length,
    totalCategories: categories.length,
  });
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

apiRouter.post('/auth/login', loginRateLimiter, (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const token = generateToken(user);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  });
});

apiRouter.get('/auth/me', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.adminUser) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  res.json({
    user: {
      id: req.adminUser.id,
      username: req.adminUser.username,
      email: req.adminUser.email,
      createdAt: req.adminUser.createdAt,
    },
  });
});

// ==========================================
// 3. PROTECTED ADMIN ROUTES (CRUD)
// ==========================================

// Get all menu items (including unavailable) for admin panel
apiRouter.get('/admin/menu', authenticateAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const items = db.getMenuItems(false);
  res.json({ success: true, count: items.length, data: items });
});

// Create new menu item
apiRouter.post('/admin/menu', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const {
    name_en,
    name_ar,
    description_en,
    description_ar,
    price_sar,
    price_usd,
    category,
    imageUrl,
    ingredients_en,
    ingredients_ar,
    isAvailable = true,
    isFeatured = false,
    calories,
    prepTime,
    spiceLevel = 0,
  } = req.body;

  if (!name_en || !name_ar || price_sar === undefined || !category) {
    res.status(400).json({ error: 'Required fields missing: name_en, name_ar, price_sar, category.' });
    return;
  }

  const newItem = db.addMenuItem({
    name_en: String(name_en).trim(),
    name_ar: String(name_ar).trim(),
    description_en: String(description_en || '').trim(),
    description_ar: String(description_ar || '').trim(),
    price_sar: Number(price_sar) || 0,
    price_usd: price_usd !== undefined ? Number(price_usd) : Math.round((Number(price_sar) / 3.75) * 100) / 100,
    category: String(category),
    imageUrl: String(imageUrl || '/src/assets/images/hero_gourmet_smash_burger_1791416652236.jpg'),
    ingredients_en: Array.isArray(ingredients_en) ? ingredients_en : [],
    ingredients_ar: Array.isArray(ingredients_ar) ? ingredients_ar : [],
    isAvailable: Boolean(isAvailable),
    isFeatured: Boolean(isFeatured),
    calories: calories !== undefined ? Number(calories) : 650,
    prepTime: prepTime ? String(prepTime) : '5-8',
    spiceLevel: spiceLevel !== undefined ? Number(spiceLevel) : 0,
  });

  res.status(201).json({ success: true, data: newItem });
});

// Update menu item
apiRouter.put('/admin/menu/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;

  // Sanitize numeric fields if provided
  if (updates.price_sar !== undefined) updates.price_sar = Number(updates.price_sar);
  if (updates.price_usd !== undefined) updates.price_usd = Number(updates.price_usd);
  if (updates.calories !== undefined) updates.calories = Number(updates.calories);
  if (updates.spiceLevel !== undefined) updates.spiceLevel = Number(updates.spiceLevel);

  const updated = db.updateMenuItem(id, updates);
  if (!updated) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }

  res.json({ success: true, data: updated });
});

// Delete menu item
apiRouter.delete('/admin/menu/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const deleted = db.deleteMenuItem(id);
  if (!deleted) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }
  res.json({ success: true, message: 'Item deleted successfully.' });
});

// Quick toggle availability
apiRouter.patch('/admin/menu/:id/toggle-available', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const item = db.getMenuItemById(id);
  if (!item) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }

  const updated = db.updateMenuItem(id, { isAvailable: !item.isAvailable });
  res.json({ success: true, data: updated });
});

// Quick toggle featured
apiRouter.patch('/admin/menu/:id/toggle-featured', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const item = db.getMenuItemById(id);
  if (!item) {
    res.status(404).json({ error: 'Menu item not found.' });
    return;
  }

  const updated = db.updateMenuItem(id, { isFeatured: !item.isFeatured });
  res.json({ success: true, data: updated });
});

// Admin Categories CRUD
apiRouter.get('/admin/categories', authenticateAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.getCategories() });
});

apiRouter.post('/admin/categories', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { name_en, name_ar, sortOrder } = req.body;
  if (!name_en || !name_ar) {
    res.status(400).json({ error: 'name_en and name_ar are required.' });
    return;
  }

  const newCat = db.addCategory({
    name_en: String(name_en).trim(),
    name_ar: String(name_ar).trim(),
    sortOrder: sortOrder !== undefined ? Number(sortOrder) : db.getCategories().length + 1,
  });

  res.status(201).json({ success: true, data: newCat });
});

apiRouter.put('/admin/categories/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const updated = db.updateCategory(id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  res.json({ success: true, data: updated });
});

apiRouter.delete('/admin/categories/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const deleted = db.deleteCategory(id);
  if (!deleted) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  res.json({ success: true, message: 'Category deleted successfully.' });
});

// Admin Site Settings CRUD
apiRouter.get('/admin/settings', authenticateAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.getSettings() });
});

apiRouter.put('/admin/settings', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

// Image Upload
apiRouter.post(
  '/admin/upload',
  authenticateAdmin,
  upload.single('image'),
  (req: AuthenticatedRequest, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded.' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: fileUrl,
      filename: req.file.filename,
    });
  }
);

// Seed reset endpoint
apiRouter.post('/admin/seed-reset', authenticateAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const reset = db.resetToDefault();
  res.json({ success: true, message: 'Database reset to default seed data.', data: reset });
});
