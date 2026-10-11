/**
 * SIZZLE & SMOKE - MongoDB (Mongoose) Schemas & Connection Template
 *
 * If you prefer using MongoDB Atlas instead of the file-based embedded store:
 * 1. npm install mongoose
 * 2. Set MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/sizzle_smoke" in .env
 * 3. Use these schemas in your production backend.
 */

/*
import mongoose, { Schema, Document } from 'mongoose';

// 1. AdminUser Schema
export interface IAdminUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export const AdminUserSchema = new Schema<IAdminUser>({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// 2. Category Schema
export interface ICategory extends Document {
  name_en: string;
  name_ar: string;
  sortOrder: number;
}

export const CategorySchema = new Schema<ICategory>({
  name_en: { type: String, required: true, trim: true },
  name_ar: { type: String, required: true, trim: true },
  sortOrder: { type: Number, default: 0 },
});

// 3. MenuItem Schema
export interface IMenuItem extends Document {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price_sar: number;
  price_usd: number;
  category: string; // or Schema.Types.ObjectId, ref: 'Category'
  imageUrl: string;
  ingredients_en: string[];
  ingredients_ar: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  calories?: number;
  prepTime?: string;
  spiceLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const MenuItemSchema = new Schema<IMenuItem>(
  {
    name_en: { type: String, required: true, trim: true },
    name_ar: { type: String, required: true, trim: true },
    description_en: { type: String, default: '' },
    description_ar: { type: String, default: '' },
    price_sar: { type: Number, required: true, min: 0 },
    price_usd: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    ingredients_en: [{ type: String }],
    ingredients_ar: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    calories: { type: Number },
    prepTime: { type: String, default: '5-8' },
    spiceLevel: { type: Number, default: 0, min: 0, max: 3 },
  },
  { timestamps: true }
);

// 4. SiteSettings Schema
export interface ISiteSettings extends Document {
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

export const SiteSettingsSchema = new Schema<ISiteSettings>({
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address_en: { type: String, default: '' },
  address_ar: { type: String, default: '' },
  openingHours_en: { type: String, default: '' },
  openingHours_ar: { type: String, default: '' },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    tiktok: { type: String, default: '' },
  },
});

export const AdminUserModel = mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);
export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);
export const MenuItemModel = mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
export const SiteSettingsModel = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
*/
