export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  weight?: number;
  height?: number;
  targetWeight?: number;
  fitnessGoal?: string;
  activityLevel?: string;
  dailyProteinTarget?: number;
  createdAt: string;
  addresses?: Address[];
  proteinGoal?: ProteinGoal;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  _count?: { products: number };
}

export interface NutritionInfo {
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  servingSize: string;
  servingsPerContainer: number;
  bcaa?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPercent: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
  nutritionInfo: NutritionInfo;
  goalTags: string[];
  flavorOptions: string[];
  sizeOptions: string[];
  model3dType?: string;
  model3dColor?: string;
  model3dLabel?: string;
  verificationCode?: string;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  price: number;
  size: string;
  flavor: string;
  quantity: number;
  totalPrice: number;
  inStock: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingFee: number;
  freeShippingThreshold: number;
  amountForFreeShipping: number;
  tax: number;
  total: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productImage?: string;
  size: string;
  flavor: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'COD' | 'CARD' | 'UPI';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: Address;
  customerNotes?: string;
  createdAt: string;
  items: OrderItem[];
  user?: { id: string; name: string; email: string };
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minSpend: number;
  expiryDate?: string;
  isActive: boolean;
  usageCount: number;
}

export interface ProteinGoal {
  id: string;
  userId: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  goal: string;
  dailyTargetGrams: number;
  minRangeGrams: number;
  maxRangeGrams: number;
  breakfastGrams: number;
  lunchGrams: number;
  dinnerGrams: number;
  snacksGrams: number;
}

export interface ProteinLog {
  id: string;
  userId: string;
  date: string;
  mealType: string;
  foodName: string;
  proteinGrams: number;
  calories?: number;
  createdAt: string;
}

export interface DailyTrackerData {
  date: string;
  targetGrams: number;
  totalConsumed: number;
  remaining: number;
  percentage: number;
  totalCalories: number;
  logs: ProteinLog[];
  weeklyProgress: Array<{
    date: string;
    day: string;
    consumed: number;
    target: number;
    achieved: boolean;
  }>;
  currentStreak: number;
  achievements: Array<{
    id: string;
    title: string;
    desc: string;
    unlocked: boolean;
    icon: string;
  }>;
  goalDetails?: ProteinGoal;
}

export interface VerificationResult {
  isAuthentic: boolean;
  code: string;
  productName?: string;
  batchNumber?: string;
  manufactureDate?: string;
  expiryDate?: string;
  labTestPdfUrl?: string;
  verificationCount?: number;
  lastVerifiedAt?: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    rating: number;
  };
  message: string;
}
