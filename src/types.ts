export type TenantTheme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
  adminTheme: 'modern-dark' | 'cyc-gold' | 'sleek-light';
};

export type TenantConfig = {
  id: string;
  name: string;
  slogan: string;
  logoUrl: string;
  bannerUrl: string;
  bannerLayout: 'center' | 'left' | 'transparent-center';
  location: string;
  phone: string;
  instagram: string;
  licenseKey: string;
  theme: TenantTheme;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  phonePrefix?: string;
  language?: 'es' | 'en';
  adminPassword?: string;
};

export type Product = {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageUrls?: string[];
  sizes?: string[];
  extraFields?: { name: string; value: string }[];
  barcode?: string;
  category: string;
  isPromo: boolean;
  isOffer: boolean;
  stock: number;
};

export type Comment = {
  id: string;
  tenantId: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  approved: boolean;
};

export type Collaborator = {
  id: string;
  tenantId: string;
  name: string;
  role: string;
  email: string;
  active: boolean;
  phone?: string;
  username?: string;
  password?: string;
  isAdmin2?: boolean;
  profileImage?: string;
  firstLoginAttempted?: boolean;
  biometricsAuthorized?: boolean;
  forceLogout?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
};

export type Delivery = {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  productBarcode?: string;
  quantity: number;
  size?: string;
  price: number;
  totalPrice: number;
  date: string; // YYYY-MM-DD
  deliveredBy: string; // Name of the person who made the delivery
};


export type RetiroOrder = {
  id: string;
  code: string;
  tenantId: string;
  date: string; // ISO
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  items: { name: string; quantity: number; size?: string; price: number }[];
  total: number;
  status: 'nuevo' | 'entregado';
};
