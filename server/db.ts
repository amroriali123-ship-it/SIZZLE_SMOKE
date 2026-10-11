import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price_sar: number;
  price_usd: number;
  category: string; // category id
  imageUrl: string;
  ingredients_en: string[];
  ingredients_ar: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  calories?: number;
  prepTime?: string;
  spiceLevel?: number; // 0, 1, 2, 3
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address_en: string;
  address_ar: string;
  openingHours_en: string;
  openingHours_ar: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
  };
}

export interface DatabaseSchema {
  users: AdminUser[];
  categories: Category[];
  menuItems: MenuItem[];
  settings: SiteSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export const getDefaultSeedData = (): DatabaseSchema => {
  // Default password: admin123456
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('admin123456', salt);

  return {
    users: [
      {
        id: 'user-admin-1',
        username: 'admin',
        email: 'admin@sizzlesmoke.com',
        passwordHash,
        createdAt: new Date().toISOString(),
      },
    ],
    categories: [
      { id: 'cat-burgers', name_en: 'Smash Burgers', name_ar: 'برجر سماش', sortOrder: 1 },
      { id: 'cat-chicken', name_en: 'Crispy Chicken', name_ar: 'دجاج كرسبي', sortOrder: 2 },
      { id: 'cat-sides', name_en: 'Loaded Sides', name_ar: 'مقبلات وبطاطس', sortOrder: 3 },
      { id: 'cat-drinks', name_en: 'Shakes & Drinks', name_ar: 'شيك ومشروبات', sortOrder: 4 },
      { id: 'cat-combos', name_en: 'Combo Boxes', name_ar: 'وجبات كومبو', sortOrder: 5 },
    ],
    menuItems: [
      {
        id: 'item-1',
        name_en: 'The Double Lava Ember Smash',
        name_ar: 'برجر لافا سماش المدخن المزدوج',
        description_en: 'Two 100% Black Angus smashed patties, molten aged English cheddar, charred caramelized onions, and house ember sauce on toasted brioche.',
        description_ar: 'شريحتان من لحم بلاك أنجوس المشوي على لهب 400°، جبنة شيدر إنجليزية ذائبة، بصل مكرمل محروق، وصلصة سموك السرية في خبز بريوش بالزبدة.',
        price_sar: 38,
        price_usd: 10.15,
        category: 'cat-burgers',
        imageUrl: '/src/assets/images/hero_gourmet_smash_burger_1791416652236.jpg',
        ingredients_en: ['Aged Angus Beef', 'Melted Cheddar', 'Caramelized Onion', 'House Ember Sauce', 'Toasted Brioche'],
        ingredients_ar: ['لحم أنجوس معتق', 'جبنة شيدر مذابة', 'بصل مكرمل', 'صلصة الشواء المدخنة', 'خبز بريوش طازج'],
        isAvailable: true,
        isFeatured: true,
        calories: 780,
        prepTime: '6-8',
        spiceLevel: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-2',
        name_en: 'Crispy Nashville Firebird',
        name_ar: 'ساندوتش كرسبي ناشفيل الناري',
        description_en: 'Ultra-crispy hand-breaded chicken breast glazed with hot spiced oil, tangy crunchy slaw, crinkle pickles, and roasted garlic aioli.',
        description_ar: 'صدر دجاج مقلي ومقرمش مغموس بزيت التوابل الحارة، سلطة كولسلو بالكرنب الطازج، مخلل شبت مقرمش، ومايونيز الثوم المحمص.',
        price_sar: 34,
        price_usd: 9.00,
        category: 'cat-chicken',
        imageUrl: '/src/assets/images/menu_crispy_chicken_sandwich_1791416661919.jpg',
        ingredients_en: ['Fresh Chicken Breast', 'Nashville Glaze', 'Crisp Slaw', 'Dill Pickles', 'Garlic Aioli'],
        ingredients_ar: ['صدر دجاج طازج', 'تتبيلة ناشفيل', 'كولسلو متبل', 'مخلل شبت', 'مايونيز الثوم'],
        isAvailable: true,
        isFeatured: true,
        calories: 690,
        prepTime: '7-9',
        spiceLevel: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-3',
        name_en: 'Loaded Waffle Skillet Fries',
        name_ar: 'بطاطس وافل لوديد بالجبن والبيكون',
        description_en: 'Crispy waffle-cut fries dusted with signature 7-spice, smothered in molten cheddar lava, crispy bacon bits, scallions, and sliced jalapeños.',
        description_ar: 'بطاطس وافل مقرمشة متبلة بخلطة 7 بهارات، مغطاة بطوفان جبن الشيدر الساخن، قطع بيكون مقرمشة، بصل أخضر وهالبينو مدخن.',
        price_sar: 24,
        price_usd: 6.40,
        category: 'cat-sides',
        imageUrl: '/src/assets/images/menu_loaded_cheese_fries_1791416671202.jpg',
        ingredients_en: ['Waffle Cut Fries', 'Real Cheddar Cheese', 'Smoked Beef Bacon Bits', 'Jalapeños', 'Scallions'],
        ingredients_ar: ['بطاطس وافل', 'صلصة جبن شيدر طبيعية', 'لحم بقري مقدد مقرمش', 'هالبينو', 'بصل أخضر'],
        isAvailable: true,
        isFeatured: true,
        calories: 520,
        prepTime: '4-6',
        spiceLevel: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-4',
        name_en: 'Truffle & Forest Mushroom Smash',
        name_ar: 'برجر ترافل ماشروم ديلاكس',
        description_en: 'Seared Angus patty topped with butter-sautéed portobello mushrooms, real black truffle aioli, and melted Swiss Emmental.',
        description_ar: 'شريحة أنجوس سميكة مع فطر بورتوبيلو المطهو ببطء في الزبدة، مايونيز الكمأة السوداء الفاخرة، وجبنة سويسرية ذائبة.',
        price_sar: 42,
        price_usd: 11.20,
        category: 'cat-burgers',
        imageUrl: '/src/assets/images/hero_gourmet_smash_burger_1791416652236.jpg',
        ingredients_en: ['Angus Beef', 'Portobello Mushrooms', 'Black Truffle Aioli', 'Swiss Cheese', 'Brioche Bun'],
        ingredients_ar: ['لحم أنجوس', 'فطر بورتوبيلو', 'صلصة ترفل سوداء', 'جبن سويسري', 'خبز بريوش'],
        isAvailable: true,
        isFeatured: false,
        calories: 740,
        prepTime: '8-10',
        spiceLevel: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-5',
        name_en: 'Golden Buttermilk Chicken Tenders',
        name_ar: 'أصابع دجاج تندر الذهبية (5 قطع)',
        description_en: '24-hour buttermilk soaked chicken tenders coated in seasoned crust, served with signature Sizzle dip & honey mustard.',
        description_ar: 'قطع تندر دجاج منقوعة 24 ساعة في مصل اللبن ومقلية حتى القرمشة الذهبية، تُقدم مع صلصة سيزل وصوص الخردل بالعسل.',
        price_sar: 28,
        price_usd: 7.50,
        category: 'cat-chicken',
        imageUrl: '/src/assets/images/menu_crispy_chicken_sandwich_1791416661919.jpg',
        ingredients_en: ['Fresh Chicken Tenders', 'Buttermilk Batter', 'Honey Mustard Dip', 'Sizzle Dip'],
        ingredients_ar: ['تندر دجاج طازج', 'خلطة بترميلك', 'صلصة هني ماسترد', 'صلصة سيزل'],
        isAvailable: true,
        isFeatured: false,
        calories: 490,
        prepTime: '6-8',
        spiceLevel: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'item-6',
        name_en: 'Ultimate Solo Feast Box',
        name_ar: 'صندوق كومبو الوليمة الفردية',
        description_en: 'Double Lava Smash burger + loaded waffle cheese fries + 2 crispy buttermilk tenders + fountain craft drink of choice.',
        description_ar: 'برجر لافا سماش مزدوج + بطاطس وافل بالجبن + 2 قطع تندر مقرمشة + مشروب غازي مثلج حسب اختيارك.',
        price_sar: 59,
        price_usd: 15.75,
        category: 'cat-combos',
        imageUrl: '/src/assets/images/hero_gourmet_smash_burger_1791416652236.jpg',
        ingredients_en: ['Double Smash Burger', 'Crispy Fries', 'Chicken Tenders', 'Craft Drink'],
        ingredients_ar: ['برجر سماش مزدوج', 'بطاطس مقرمشة', 'تندر دجاج', 'مشروب منعش'],
        isAvailable: true,
        isFeatured: true,
        calories: 1250,
        prepTime: '8-10',
        spiceLevel: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    settings: {
      phone: '+966 11 489 3322',
      email: 'care@sizzleandsmoke-grill.com',
      address_en: 'Prince Turki 1st Road, An Nakheel Dist, Riyadh, Saudi Arabia',
      address_ar: 'طريق الأمير تركي الأول، حي النخيل، الرياض، المملكة العربية السعودية',
      openingHours_en: 'Daily: 12:00 PM - 03:00 AM',
      openingHours_ar: 'يومياً: 12:00 ظهراً - 03:00 فجراً',
      socialLinks: {
        instagram: 'https://instagram.com/sizzleandsmoke',
        twitter: 'https://twitter.com/sizzleandsmoke',
        tiktok: 'https://tiktok.com/@sizzleandsmoke',
        facebook: 'https://facebook.com/sizzleandsmoke',
      },
    },
  };
};

export class Database {
  private static instance: Database;
  private data: DatabaseSchema;

  private constructor() {
    this.data = this.readFromDisk();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private readFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to read db.json, using defaults:', err);
    }
    const defaultData = getDefaultSeedData();
    this.writeToDisk(defaultData);
    return defaultData;
  }

  private writeToDisk(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to db.json:', err);
    }
  }

  public save(): void {
    this.writeToDisk(this.data);
  }

  public resetToDefault(): DatabaseSchema {
    this.data = getDefaultSeedData();
    this.save();
    return this.data;
  }

  // Users
  public getUsers(): AdminUser[] {
    return this.data.users;
  }

  public getUserByEmail(email: string): AdminUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): AdminUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  // Categories
  public getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public getCategoryById(id: string): Category | undefined {
    return this.data.categories.find(c => c.id === id);
  }

  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCategory: Category = {
      ...cat,
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Menu Items
  public getMenuItems(onlyAvailable = false): MenuItem[] {
    if (onlyAvailable) {
      return this.data.menuItems.filter(item => item.isAvailable);
    }
    return this.data.menuItems;
  }

  public getMenuItemById(id: string): MenuItem | undefined {
    return this.data.menuItems.find(item => item.id === id);
  }

  public addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.menuItems.unshift(newItem);
    this.save();
    return newItem;
  }

  public updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const idx = this.data.menuItems.findIndex(item => item.id === id);
    if (idx === -1) return null;
    this.data.menuItems[idx] = {
      ...this.data.menuItems[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.menuItems[idx];
  }

  public deleteMenuItem(id: string): boolean {
    const initialLen = this.data.menuItems.length;
    this.data.menuItems = this.data.menuItems.filter(item => item.id !== id);
    if (this.data.menuItems.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Settings
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      socialLinks: {
        ...this.data.settings.socialLinks,
        ...(updates.socialLinks || {}),
      },
    };
    this.save();
    return this.data.settings;
  }
}

export const db = Database.getInstance();
