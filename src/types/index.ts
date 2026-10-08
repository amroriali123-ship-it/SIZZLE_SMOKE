export type Language = 'ar' | 'en';

export interface MenuItem {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  category: 'burgers' | 'chicken' | 'sides' | 'drinks' | 'combos';
  description: {
    ar: string;
    en: string;
  };
  price: number; // in SAR
  image: string;
  calories: number;
  prepTime: string;
  spiceLevel: 0 | 1 | 2 | 3; // 0 = non-spicy, 3 = extra hot
  tags: {
    ar: string[];
    en: string[];
  };
  ingredients: {
    ar: string[];
    en: string[];
  };
  allergens?: {
    ar: string[];
    en: string[];
  };
  isPopular?: boolean;
  isChefSpecial?: boolean;
}

export interface CartItemOption {
  name: { ar: string; en: string };
  price: number;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedOptions: CartItemOption[];
  specialNotes?: string;
}

export interface Branch {
  id: string;
  name: { ar: string; en: string };
  city: { ar: string; en: string };
  address: { ar: string; en: string };
  coordinates: { x: number; y: number }; // Relative percentage for map visualization
  phone: string;
  hours: { ar: string; en: string };
  deliveryTime: string;
  indoorSeating: boolean;
  terraceSeating: boolean;
  familySections: boolean;
  driveThru: boolean;
  googleMapQuery: string;
}

export interface TableSlot {
  id: string;
  number: string;
  zone: 'indoor' | 'terrace' | 'vip' | 'counter';
  capacity: number;
  status: 'available' | 'reserved' | 'occupied';
}

export interface Reservation {
  id: string;
  referenceNumber: string;
  customerName: string;
  phone: string;
  email: string;
  branchId: string;
  branchName: { ar: string; en: string };
  date: string;
  timeSlot: string;
  partySize: number;
  zone: 'indoor' | 'terrace' | 'vip' | 'counter';
  tableNumber: string;
  specialRequests?: string;
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  authorName: { ar: string; en: string };
  avatarInitials: string;
  rating: number; // 1 to 5
  foodRating: number;
  speedRating: number;
  ambianceRating: number;
  comment: { ar: string; en: string };
  date: string;
  favoriteItem: { ar: string; en: string };
  verifiedDiner: boolean;
}
