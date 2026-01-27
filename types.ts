
export interface FullProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand: string;
  image: string;
  images: string[];
  videoUrl?: string;
  description: string;
  category: string;
  warrantyInfo: string;
  keyFeatures: string[];
  technicalSpecs: Record<string, string>;
  gbpReviews: {user: string, comment: string, rating: number, date: string}[];
  realWorkImages: string[];
}

export interface Product extends FullProduct {}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  tier: 'Standard' | 'Gold VIP' | 'Elite' | 'Ambassador';
  is_verified: boolean;
  preferences?: string[];
  address_metadata?: {
    estate?: string;
    lat?: number;
    lng?: number;
    house_no?: string;
  };
}

export interface DriverMission {
  id: string;
  order_id: string;
  driver_id: string;
  mission_status: 'assigned' | 'in_transit' | 'on_site' | 'completed';
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
}

export interface LiveDeliveryPing {
  id: number;
  mission_id: string;
  order_id: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: 'pending' | 'Paid' | 'Payment Failed' | 'shipped' | 'delivered';
  current_step?: number;
  mpesa_checkout_id?: string;
  mpesa_receipt?: string;
  delivery_address?: any;
  delivery_lat?: number;
  delivery_lng?: number;
  site_surface_type?: string;
  floor_number?: number;
  items?: any[];
  created_at?: string;
  assigned_engineer?: {
    name: string;
    photo: string;
    eta: string;
    phone: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}
