-- ============================================================
-- SIZZLE & SMOKE - Initial Seed Data (SQL)
-- ============================================================

-- 1. Insert Default Admin User
-- Email: admin@sizzlesmoke.com
-- Password: admin123456
-- Password Hash: bcrypt with 10 salt rounds ($2a$10$wK1eE8pU.7o6XjH8yU78beK8E2Q.4yTjFvE6i7mN1Q6sZgA7j.a2G)
INSERT INTO admin_users (id, username, email, password_hash, created_at)
VALUES (
    'user-admin-1',
    'admin',
    'admin@sizzlesmoke.com',
    '$2a$10$Q3JcR3b3yQ7mN6kP9vT0ReU6XjH8yU78beK8E2Q.4yTjFvE6i7mN1',
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (id, name_en, name_ar, sort_order) VALUES
('cat-burgers', 'Smash Burgers', 'برجر سماش', 1),
('cat-chicken', 'Crispy Chicken', 'دجاج كرسبي', 2),
('cat-sides', 'Loaded Sides', 'مقبلات وبطاطس', 3),
('cat-drinks', 'Shakes & Drinks', 'شيك ومشروبات', 4),
('cat-combos', 'Combo Boxes', 'وجبات كومبو', 5)
ON CONFLICT (id) DO UPDATE SET
name_en = EXCLUDED.name_en,
name_ar = EXCLUDED.name_ar,
sort_order = EXCLUDED.sort_order;

-- 3. Insert Menu Items
INSERT INTO menu_items (
    id, name_en, name_ar, description_en, description_ar,
    price_sar, price_usd, category_id, image_url,
    ingredients_en, ingredients_ar, is_available, is_featured,
    calories, prep_time, spice_level, created_at, updated_at
) VALUES
(
    'item-1',
    'The Double Lava Ember Smash',
    'برجر لافا سماش المدخن المزدوج',
    'Two 100% Black Angus smashed patties, molten aged English cheddar, charred caramelized onions, and house ember sauce on toasted brioche.',
    'شريحتان من لحم بلاك أنجوس المشوي على لهب 400°، جبنة شيدر إنجليزية ذائبة، بصل مكرمل محروق، وصلصة سموك السرية في خبز بريوش بالزبدة.',
    38.00,
    10.15,
    'cat-burgers',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    '["Aged Angus Beef", "Melted Cheddar", "Caramelized Onion", "House Ember Sauce", "Toasted Brioche"]',
    '["لحم أنجوس معتق", "جبنة شيدر مذابة", "بصل مكرمل", "صلصة الشواء المدخنة", "خبز بريوش طازج"]',
    TRUE,
    TRUE,
    780,
    '6-8',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item-2',
    'Crispy Nashville Firebird',
    'ساندوتش كرسبي ناشفيل الناري',
    'Ultra-crispy hand-breaded chicken breast glazed with hot spiced oil, tangy crunchy slaw, crinkle pickles, and roasted garlic aioli.',
    'صدر دجاج مقلي ومقرمش مغموس بزيت التوابل الحارة، سلطة كولسلو بالكرنب الطازج، مخلل شبت مقرمش، ومايونيز الثوم المحمص.',
    34.00,
    9.00,
    'cat-chicken',
    'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
    '["Fresh Chicken Breast", "Nashville Glaze", "Crisp Slaw", "Dill Pickles", "Garlic Aioli"]',
    '["صدر دجاج طازج", "تتبيلة ناشفيل", "كولسلو متبل", "مخلل شبت", "مايونيز الثوم"]',
    TRUE,
    TRUE,
    690,
    '7-9',
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item-3',
    'Loaded Waffle Skillet Fries',
    'بطاطس وافل لوديد بالجبن والبيكون',
    'Crispy waffle-cut fries dusted with signature 7-spice, smothered in molten cheddar lava, crispy bacon bits, scallions, and sliced jalapeños.',
    'بطاطس وافل مقرمشة متبلة بخلطة 7 بهارات، مغطاة بطوفان جبن الشيدر الساخن، قطع بيكون مقرمشة، بصل أخضر وهالبينو مدخن.',
    24.00,
    6.40,
    'cat-sides',
    'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    '["Waffle Cut Fries", "Real Cheddar Cheese", "Smoked Beef Bacon Bits", "Jalapeños", "Scallions"]',
    '["بطاطس وافل", "صلصة جبن شيدر طبيعية", "لحم بقري مقدد مقرمش", "هالبينو", "بصل أخضر"]',
    TRUE,
    TRUE,
    520,
    '4-6',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item-4',
    'Truffle & Forest Mushroom Smash',
    'برجر ترافل ماشروم ديلاكس',
    'Seared Angus patty topped with butter-sautéed portobello mushrooms, real black truffle aioli, and melted Swiss Emmental.',
    'شريحة أنجوس سميكة مع فطر بورتوبيلو المطهو ببطء في الزبدة، مايونيز الكمأة السوداء الفاخرة، وجبنة سويسرية ذائبة.',
    42.00,
    11.20,
    'cat-burgers',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    '["Angus Beef", "Portobello Mushrooms", "Black Truffle Aioli", "Swiss Cheese", "Brioche Bun"]',
    '["لحم أنجوس", "فطر بورتوبيلو", "صلصة ترفل سوداء", "جبن سويسري", "خبز بريوش"]',
    TRUE,
    FALSE,
    740,
    '8-10',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item-5',
    'Golden Buttermilk Chicken Tenders',
    'أصابع دجاج تندر الذهبية (5 قطع)',
    '24-hour buttermilk soaked chicken tenders coated in seasoned crust, served with signature Sizzle dip & honey mustard.',
    'قطع تندر دجاج منقوعة 24 ساعة في مصل اللبن ومقلية حتى القرمشة الذهبية، تُقدم مع صلصة سيزل وصوص الخردل بالعسل.',
    28.00,
    7.50,
    'cat-chicken',
    'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    '["Fresh Chicken Tenders", "Buttermilk Batter", "Honey Mustard Dip", "Sizzle Dip"]',
    '["تندر دجاج طازج", "خلطة بترميلك", "صلصة هني ماسترد", "صلصة سيزل"]',
    TRUE,
    FALSE,
    490,
    '6-8',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'item-6',
    'Ultimate Solo Feast Box',
    'صندوق كومبو الوليمة الفردية',
    'Double Lava Smash burger + loaded waffle cheese fries + 2 crispy buttermilk tenders + fountain craft drink of choice.',
    'برجر لافا سماش مزدوج + بطاطس وافل بالجبن + 2 قطع تندر مقرمشة + مشروب غازي مثلج حسب اختيارك.',
    59.00,
    15.75,
    'cat-combos',
    'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80',
    '["Double Smash Burger", "Crispy Fries", "Chicken Tenders", "Craft Drink"]',
    '["برجر سماش مزدوج", "بطاطس مقرمشة", "تندر دجاج", "مشروب منعش"]',
    TRUE,
    TRUE,
    1250,
    '8-10',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Default Site Settings
INSERT INTO site_settings (
    id, phone, email, address_en, address_ar, opening_hours_en, opening_hours_ar, social_links
) VALUES (
    1,
    '+966 11 489 3322',
    'care@sizzleandsmoke-grill.com',
    'Prince Turki 1st Road, An Nakheel Dist, Riyadh, Saudi Arabia',
    'طريق الأمير تركي الأول، حي النخيل، الرياض، المملكة العربية السعودية',
    'Daily: 12:00 PM - 03:00 AM',
    'يومياً: 12:00 ظهراً - 03:00 فجراً',
    '{"instagram": "https://instagram.com/sizzleandsmoke", "twitter": "https://twitter.com/sizzleandsmoke", "tiktok": "https://tiktok.com/@sizzleandsmoke", "facebook": "https://facebook.com/sizzleandsmoke"}'
)
ON CONFLICT (id) DO UPDATE SET
phone = EXCLUDED.phone,
email = EXCLUDED.email,
address_en = EXCLUDED.address_en,
address_ar = EXCLUDED.address_ar,
opening_hours_en = EXCLUDED.opening_hours_en,
opening_hours_ar = EXCLUDED.opening_hours_ar,
social_links = EXCLUDED.social_links;
