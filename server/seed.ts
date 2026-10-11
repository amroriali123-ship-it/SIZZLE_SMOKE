/**
 * Standalone Database Seeder
 * Run with: npx tsx server/seed.ts
 */
import { db } from './db.js';

console.log('--- SIZZLE & SMOKE DATABASE SEEDER ---');
console.log('Seeding initial Admin user, categories, and signature menu items...');

const seeded = db.resetToDefault();

console.log(`✅ Seed Completed Successfully!`);
console.log(`- Admin User: ${seeded.users[0].email} (Password: admin123456)`);
console.log(`- Categories: ${seeded.categories.length}`);
console.log(`- Menu Items: ${seeded.menuItems.length}`);
console.log(`- Site Settings: Configured`);
console.log('--------------------------------------');
