import { MenuItem, Branch, CustomerReview, TableSlot } from '../types';
import HERO_IMAGE from '../assets/images/hero_gourmet_smash_burger_1791416652236.jpg';
import CHICKEN_IMAGE from '../assets/images/menu_crispy_chicken_sandwich_1791416661919.jpg';
import FRIES_IMAGE from '../assets/images/menu_loaded_cheese_fries_1791416671202.jpg';
import AMBIANCE_IMAGE from '../assets/images/restaurant_interior_ambiance_1791416680708.jpg';

export { HERO_IMAGE, CHICKEN_IMAGE, FRIES_IMAGE, AMBIANCE_IMAGE };

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: {
      ar: 'برجر لافا سماش المدخن المزدوج',
      en: 'The Double Lava Ember Smash',
    },
    category: 'burgers',
    description: {
      ar: 'شريحتان من لحم بلاك أنجوس المشوي على لهب 400°، جبنة شيدر إنجليزية ذائبة، بصل مكرمل محروق، وصلصة سموك السرية في خبز بريوش بالزبدة.',
      en: 'Two 100% Black Angus smashed patties, molten aged English cheddar, charred caramelized onions, and house ember sauce on toasted brioche.',
    },
    price: 38,
    image: HERO_IMAGE,
    calories: 780,
    prepTime: '6-8',
    spiceLevel: 1,
    tags: {
      ar: ['الأكثر طلباً', 'توقيع الشيف'],
      en: ['Best Seller', 'Signature'],
    },
    ingredients: {
      ar: ['لحم أنجوس معتق', 'جبنة شيدر مذابة', 'بصل مكرمل', 'صلصة الشواء المدخنة', 'خبز بريوش طازج'],
      en: ['Aged Angus Beef', 'Melted Cheddar', 'Caramelized Onion', 'House Ember Sauce', 'Toasted Brioche'],
    },
    allergens: {
      ar: ['غلوتين', 'مشتقات الحليب', 'بيض'],
      en: ['Gluten', 'Dairy', 'Eggs'],
    },
    isPopular: true,
    isChefSpecial: true,
  },
  {
    id: 'm2',
    name: {
      ar: 'ساندوتش كرسبي ناشفيل الناري',
      en: 'Crispy Nashville Firebird',
    },
    category: 'chicken',
    description: {
      ar: 'صدر دجاج مقلي ومقرمش مغموس بزيت التوابل الحارة، سلطة كولسلو بالكرنب الطازج، مخلل شبت مقرمش، ومايونيز الثوم المحمص.',
      en: 'Ultra-crispy hand-breaded chicken breast glazed with hot spiced oil, tangy crunchy slaw, crinkle pickles, and roasted garlic aioli.',
    },
    price: 34,
    image: CHICKEN_IMAGE,
    calories: 690,
    prepTime: '7-9',
    spiceLevel: 3,
    tags: {
      ar: ['حار ناري', 'مقرمش استثنائي'],
      en: ['Fiery Hot', 'Extra Crispy'],
    },
    ingredients: {
      ar: ['صدر دجاج طازج', 'تتبيلة ناشفيل', 'كولسلو متبل', 'مخلل شبت', 'مايونيز الثوم'],
      en: ['Fresh Chicken Breast', 'Nashville Glaze', 'Crisp Slaw', 'Dill Pickles', 'Garlic Aioli'],
    },
    allergens: {
      ar: ['غلوتين', 'مشتقات الحليب'],
      en: ['Gluten', 'Dairy'],
    },
    isPopular: true,
  },
  {
    id: 'm3',
    name: {
      ar: 'بطاطس وافل لوديد بالجبن والبيكون',
      en: 'Loaded Waffle Skillet Fries',
    },
    category: 'sides',
    description: {
      ar: 'بطاطس وافل مقرمشة متبلة بخلطة 7 بهارات، مغطاة بطوفان جبن الشيدر الساخن، قطع بيكون مقرمشة، بصل أخضر وهالبينو مدخن.',
      en: 'Crispy waffle-cut fries dusted with signature 7-spice, smothered in molten cheddar lava, crispy bacon bits, scallions, and sliced jalapeños.',
    },
    price: 24,
    image: FRIES_IMAGE,
    calories: 520,
    prepTime: '4-6',
    spiceLevel: 1,
    tags: {
      ar: ['للمشاركة', 'غموس غني'],
      en: ['Great to Share', 'Cheese Lava'],
    },
    ingredients: {
      ar: ['بطاطس وافل', 'صلصة جبن شيدر طبيعية', 'لحم بقري مقدد مقرمش', 'هالبينو', 'بصل أخضر'],
      en: ['Waffle Cut Fries', 'Real Cheddar Cheese', 'Smoked Beef Bacon Bits', 'Jalapeños', 'Scallions'],
    },
    allergens: {
      ar: ['مشتقات الحليب'],
      en: ['Dairy'],
    },
    isPopular: true,
  },
  {
    id: 'm4',
    name: {
      ar: 'برجر ترافل ماشروم ديلاكس',
      en: 'Truffle & Forest Mushroom Smash',
    },
    category: 'burgers',
    description: {
      ar: 'شريحة أنجوس سميكة مع فطر بورتوبيلو المطهو ببطء في الزبدة، مايونيز الكمأة السوداء الفاخرة، وجبنة سويسرية ذائبة.',
      en: 'Seared Angus patty topped with butter-sautéed portobello mushrooms, real black truffle aioli, and melted Swiss Emmental.',
    },
    price: 42,
    image: HERO_IMAGE,
    calories: 740,
    prepTime: '8-10',
    spiceLevel: 0,
    tags: {
      ar: ['فاخر', 'نكهة ترفل'],
      en: ['Gourmet', 'Truffle Infused'],
    },
    ingredients: {
      ar: ['لحم أنجوس', 'فطر بورتوبيلو', 'صلصة ترفل سوداء', 'جبن سويسري', 'خبز بريوش'],
      en: ['Angus Beef', 'Portobello Mushrooms', 'Black Truffle Aioli', 'Swiss Cheese', 'Brioche Bun'],
    },
    allergens: {
      ar: ['غلوتين', 'مشتقات الحليب', 'بيض'],
      en: ['Gluten', 'Dairy', 'Eggs'],
    },
    isChefSpecial: true,
  },
  {
    id: 'm5',
    name: {
      ar: 'أصابع دجاج تندر الذهبية (5 قطع)',
      en: 'Golden Buttermilk Chicken Tenders',
    },
    category: 'chicken',
    description: {
      ar: 'قطع تندر دجاج منقوعة 24 ساعة في مصل اللبن ومقلية حتى القرمشة الذهبية، تُقدم مع صلصة سيزل وصوص الخردل بالعسل.',
      en: '24-hour buttermilk soaked chicken tenders coated in seasoned crust, served with signature Sizzle dip & honey mustard.',
    },
    price: 28,
    image: CHICKEN_IMAGE,
    calories: 490,
    prepTime: '6-8',
    spiceLevel: 0,
    tags: {
      ar: ['قرمشة خفيفة', 'صلصات مجانية'],
      en: ['Kids Favorite', 'Dips Included'],
    },
    ingredients: {
      ar: ['تندر دجاج طازج', 'خلطة بترميلك', 'صلصة هني ماسترد', 'صلصة سيزل'],
      en: ['Fresh Chicken Tenders', 'Buttermilk Batter', 'Honey Mustard Dip', 'Sizzle Dip'],
    },
    allergens: {
      ar: ['غلوتين', 'مشتقات الحليب'],
      en: ['Gluten', 'Dairy'],
    },
  },
  {
    id: 'm6',
    name: {
      ar: 'صندوق كومبو الوليمة الفردية',
      en: 'Ultimate Solo Feast Box',
    },
    category: 'combos',
    description: {
      ar: 'برجر لافا سماش مزدوج + بطاطس وافل بالجبن + 2 قطع تندر مقرمشة + مشروب غازي مثلج حسب اختيارك.',
      en: 'Double Lava Smash burger + loaded waffle cheese fries + 2 crispy buttermilk tenders + fountain craft drink of choice.',
    },
    price: 59,
    image: HERO_IMAGE,
    calories: 1250,
    prepTime: '8-10',
    spiceLevel: 1,
    tags: {
      ar: ['قيمة ممتازة', 'وجبة متكاملة'],
      en: ['Best Value', 'All-in-One'],
    },
    ingredients: {
      ar: ['برجر سماش مزدوج', 'بطاطس مقرمشة', 'تندر دجاج', 'مشروب منعش'],
      en: ['Double Smash Burger', 'Crispy Fries', 'Chicken Tenders', 'Craft Drink'],
    },
    allergens: {
      ar: ['غلوتين', 'مشتقات الحليب', 'بيض'],
      en: ['Gluten', 'Dairy', 'Eggs'],
    },
    isPopular: true,
  },
  {
    id: 'm7',
    name: {
      ar: 'ميلك شيك كراميل اللوتس والمدخن',
      en: 'Smoked Sea Salt Caramel Milkshake',
    },
    category: 'drinks',
    description: {
      ar: 'آيس كريم فانيليا طبيعي كثيف مخفوق مع صوص الكراميل المملح، بسكويت لوتس مفتت، وكريمة خفق طازجة.',
      en: 'Velvety artisanal vanilla custard blended with smoked sea salt caramel, Lotus Biscoff crumbles, and fresh whipped cream.',
    },
    price: 19,
    image: FRIES_IMAGE, // Fallback asset container
    calories: 420,
    prepTime: '3-4',
    spiceLevel: 0,
    tags: {
      ar: ['حلى بارد', 'مخفوق يدوي'],
      en: ['Thick Shake', 'Hand-Crafted'],
    },
    ingredients: {
      ar: ['آيس كريم فانيليا', 'كراميل مملح', 'بسكويت لوتس', 'كريمة خفق'],
      en: ['Vanilla Custard', 'Salted Caramel', 'Biscoff Biscuit', 'Whipped Cream'],
    },
    allergens: {
      ar: ['مشتقات الحليب'],
      en: ['Dairy'],
    },
  },
  {
    id: 'm8',
    name: {
      ar: 'شاي مثلج بالخوخ والريحان المدخن',
      en: 'Smoked Peach & Basil Craft Iced Tea',
    },
    category: 'drinks',
    description: {
      ar: 'شاي أسود معتق مع هريس الخوخ الطبيعي، لمسة ريحان طازج، وقطع ثلج كريستالية.',
      en: 'Slow-brewed Ceylon black tea infused with natural white peach purée, bruised garden basil, and crystal ice.',
    },
    price: 14,
    image: CHICKEN_IMAGE,
    calories: 110,
    prepTime: '2-3',
    spiceLevel: 0,
    tags: {
      ar: ['منعش طبيعي', 'سكر خفيف'],
      en: ['Refreshing', 'Low Calorie'],
    },
    ingredients: {
      ar: ['شاي أسود سيلاني', 'عصير خوخ طبيعي', 'أوراق ريحان', 'ليمون'],
      en: ['Ceylon Tea', 'Peach Puree', 'Fresh Basil Leaves', 'Lemon Slice'],
    },
    allergens: {
      ar: [],
      en: [],
    },
  },
];

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'b-riyadh',
    name: {
      ar: 'فرع الرياض - طريق الأمير تركي الأول',
      en: 'Riyadh Branch - Prince Turki 1st Rd',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'طريق الأمير تركي الأول، حي النخيل، مقابل بوليفارد الرياض',
      en: 'Prince Turki 1st Road, An Nakheel Dist, Opp. Boulevard Riyadh',
    },
    coordinates: { x: 52, y: 44 },
    phone: '+966 11 489 3322',
    hours: {
      ar: 'يومياً: 12:00 ظهراً - 03:00 فجراً',
      en: 'Daily: 12:00 PM - 03:00 AM',
    },
    deliveryTime: '20-30 min',
    indoorSeating: true,
    terraceSeating: true,
    familySections: true,
    driveThru: true,
    googleMapQuery: 'https://maps.google.com/?q=Riyadh+Boulevard',
  },
  {
    id: 'b-jeddah',
    name: {
      ar: 'فرع جدة - الكورنيش الشمالي',
      en: 'Jeddah Branch - North Corniche Promenade',
    },
    city: { ar: 'جدة', en: 'Jeddah' },
    address: {
      ar: 'طريق الكورنيش، حي الشاطئ، إطلالة بحرية مباشرة',
      en: 'Corniche Road, Ash Shati District, Waterfront View',
    },
    coordinates: { x: 26, y: 62 },
    phone: '+966 12 654 8899',
    hours: {
      ar: 'يومياً: 01:00 ظهراً - 03:30 فجراً',
      en: 'Daily: 01:00 PM - 03:30 AM',
    },
    deliveryTime: '25-35 min',
    indoorSeating: true,
    terraceSeating: true,
    familySections: true,
    driveThru: false,
    googleMapQuery: 'https://maps.google.com/?q=Jeddah+Corniche',
  },
  {
    id: 'b-khobar',
    name: {
      ar: 'فرع الخبر - الواجهة البحرية',
      en: 'Khobar Branch - Seafront Walk',
    },
    city: { ar: 'الخبر', en: 'Khobar' },
    address: {
      ar: 'شارع الأمير فيصل بن فهد (البيبسي)، حي الحزام الذهبي',
      en: 'Prince Faisal Bin Fahd St (Pepsi St), Al Hizam Al Thahabi',
    },
    coordinates: { x: 78, y: 48 },
    phone: '+966 13 898 7711',
    hours: {
      ar: 'يومياً: 12:30 ظهراً - 02:30 فجراً',
      en: 'Daily: 12:30 PM - 02:30 AM',
    },
    deliveryTime: '20-30 min',
    indoorSeating: true,
    terraceSeating: true,
    familySections: true,
    driveThru: true,
    googleMapQuery: 'https://maps.google.com/?q=Khobar+Waterfront',
  },
];

export const MOCK_TABLES: TableSlot[] = [
  { id: 't1', number: 'T-01', zone: 'indoor', capacity: 2, status: 'available' },
  { id: 't2', number: 'T-02', zone: 'indoor', capacity: 4, status: 'available' },
  { id: 't3', number: 'T-03', zone: 'indoor', capacity: 4, status: 'reserved' },
  { id: 't4', number: 'T-04', zone: 'indoor', capacity: 6, status: 'available' },
  { id: 't5', number: 'T-05', zone: 'terrace', capacity: 2, status: 'available' },
  { id: 't6', number: 'T-06', zone: 'terrace', capacity: 4, status: 'available' },
  { id: 't7', number: 'T-07', zone: 'terrace', capacity: 4, status: 'reserved' },
  { id: 't8', number: 'T-08', zone: 'terrace', capacity: 6, status: 'available' },
  { id: 't9', number: 'T-09', zone: 'vip', capacity: 6, status: 'available' },
  { id: 't10', number: 'T-10', zone: 'vip', capacity: 8, status: 'available' },
  { id: 't11', number: 'T-11', zone: 'counter', capacity: 1, status: 'available' },
  { id: 't12', number: 'T-12', zone: 'counter', capacity: 2, status: 'available' },
];

export const MOCK_REVIEWS: CustomerReview[] = [
  {
    id: 'r1',
    authorName: { ar: 'سلطان الشمري', en: 'Sultan Al-Shammari' },
    avatarInitials: 'س.ش',
    rating: 5,
    foodRating: 5,
    speedRating: 5,
    ambianceRating: 5,
    comment: {
      ar: 'أفضل برجر سماش أكلته في الرياض بدون أي مبالغة! كراميل اللحم مقرمش جداً والخبز خفيف مثل الغيمة ولا يثقل على المعدة. خدمة الطاقم سريعة ومحترمة للغاية.',
      en: 'Hands down the best smash burger in Riyadh! The crust on the Angus patty is deeply caramelized and the brioche bun is pillowy and never soggy. Staff is top-notch.',
    },
    date: '2026-10-04',
    favoriteItem: { ar: 'برجر لافا سماش المدخن المزدوج', en: 'The Double Lava Ember Smash' },
    verifiedDiner: true,
  },
  {
    id: 'r2',
    authorName: { ar: 'ريم القحطاني', en: 'Reem Al-Qahtani' },
    avatarInitials: 'ر.ق',
    rating: 5,
    foodRating: 5,
    speedRating: 4,
    ambianceRating: 5,
    comment: {
      ar: 'ساندوتش كرسبي ناشفيل يفوز! القرمشة مسموعة من أول قضمة، وتوازن المخلل مع صوص الثوم معتدل جداً. حجزنا الطاولة أونلاين وكانت جاهزة بالدقيقة.',
      en: 'The Nashville Firebird chicken is unbelievable! The crunch is loud and the sauce heat level is well-balanced. Table booking online was prompt and ready upon arrival.',
    },
    date: '2026-10-02',
    favoriteItem: { ar: 'ساندوتش كرسبي ناشفيل الناري', en: 'Crispy Nashville Firebird' },
    verifiedDiner: true,
  },
  {
    id: 'r3',
    authorName: { ar: 'طارق الزهراني', en: 'Tariq Al-Zahrani' },
    avatarInitials: 'ط.ز',
    rating: 5,
    foodRating: 5,
    speedRating: 5,
    ambianceRating: 4,
    comment: {
      ar: 'بطاطس الوافل مع جبن الشيدر الذائب إدمان حقيقي. كمية سخية ونكهة بهارات فريدة. تجربة لا تُنسى وسأكرر الزيارة بالتأكيد.',
      en: 'The loaded waffle fries skillet is pure perfection. Generous portions, smoky bacon bits and real cheese sauce. Will definitely return with friends.',
    },
    date: '2026-09-28',
    favoriteItem: { ar: 'بطاطس وافل لوديد بالجبن', en: 'Loaded Waffle Skillet Fries' },
    verifiedDiner: true,
  },
  {
    id: 'r4',
    authorName: { ar: 'عبدالله السعدون', en: 'Abdullah Al-Saadoun' },
    avatarInitials: 'ع.س',
    rating: 4,
    foodRating: 5,
    speedRating: 4,
    ambianceRating: 5,
    comment: {
      ar: 'برجر الترافل والماشروم راقي جداً وله طابع المطاعم الفاخرة ولكن بسعر وجودة الوجبات السريعة الممتازة. الجلسة في التراس الخارجي ساحرة في المساء.',
      en: 'Truffle Mushroom Smash tastes like something from a high-end steakhouse, yet fast and accessible. The open terrace seating in the evening is delightful.',
    },
    date: '2026-09-22',
    favoriteItem: { ar: 'برجر ترافل ماشروم ديلاكس', en: 'Truffle & Forest Mushroom Smash' },
    verifiedDiner: true,
  },
];
