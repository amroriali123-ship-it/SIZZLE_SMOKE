-- ============================================================
-- SIZZLE & SMOKE - Relational Database Schema (SQL)
-- Compatible with PostgreSQL, MySQL 8+, SQLite, and Supabase
-- ============================================================

-- 1. Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    sort_order INT DEFAULT 0
);

-- 3. Table: menu_items
CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(64) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    price_sar NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    category_id VARCHAR(64) NOT NULL,
    image_url TEXT,
    ingredients_en JSON, -- or TEXT[] in PostgreSQL
    ingredients_ar JSON,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    calories INT DEFAULT 650,
    prep_time VARCHAR(50) DEFAULT '6-8',
    spice_level INT DEFAULT 0, -- 0 = mild, 1 = low, 2 = medium, 3 = hot
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Table: site_settings
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address_en TEXT NOT NULL,
    address_ar TEXT NOT NULL,
    opening_hours_en VARCHAR(150) NOT NULL,
    opening_hours_ar VARCHAR(150) NOT NULL,
    social_links JSON,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(sort_order);
