import { Product, BlogPost } from './types';

export const SITE_NAME = "Smart Duka Electronics";
export const DOMAIN = "www.smartdukaelectronics.co.ke";
export const EMAIL_SUPPORT = "smartdukakenya@gmail.com";

/**
 * LOGO_URL: Official Smart Duka logo (House Icon + Electronics).
 * Updated to match the design provided by the user.
 */
export const LOGO_URL = "https://i.ibb.co/VYBqQpY/logo-smart.png";

export const INSTALLABLE_CATEGORIES = {
  TV: ["TVs", "OLED & QLED TVs"],
  KITCHEN: ["Kitchen Appliances", "Home Appliances"] 
};

export const PRICING_ENGINE = {
  transport: 200,
  labor: {
    '32"': 1500,
    '43"': 1500,
    '50"': 1500,
    '55"': 1500,
    '65"': 2500,
    '75"': 3500,
    '85"': 5000,
    '98"+': 8000
  },
  bracketFixed: {
    '32"': 1000,
    '43"': 1500,
    '50"': 2000,
    '55"': 2500,
    '65"': 2500,
    '75"': 5000,
    '85"': 7000,
    '98"+': 13000
  },
  bracketSwivel: {
    '32"': 1500,
    '43"': 2000,
    '50"': 2500,
    '55"': 4500,
    '65"': 4500,
    '75"': 4500,
    '85"': 6500,
    '98"+': 22000
  },
  addons: {
    backlights_supply: 1300,
    soundbarLabor: 1000,
    kitchenInstallation: 3500
  }
};

export const CATEGORIES = [
  { id: 1, name: "Home Appliances", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "OLED & QLED TVs", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Audio Systems", image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Phones & Laptops", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Kitchen Appliances", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Gaming Hub", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" }
];

export const CAROUSEL_DATA = [
  {
    id: 1,
    title: "Upgrade Your Home Today",
    subtitle: "New Arrivals",
    desc: "Premium kitchen appliances and home solutions from top brands like Hisense and Samsung.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1600",
    btnText: "Shop Appliances"
  },
  {
    id: 2,
    title: "Huge Discounts on TVs",
    subtitle: "TV Sales",
    desc: "Experience 4K and 8K clarity. Get the best TV prices in Nairobi with free delivery options.",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=1600",
    btnText: "Shop TVs"
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'h-a6k-55',
    name: 'Hisense 55" A6K Series 4K UHD Smart TV',
    slug: 'hisense-55-a6k-4k-tv',
    price: 54500,
    brand: 'Hisense',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=1200'],
    description: 'The best value 4K TV in Kenya. Features AI 4K Upscaling and Dolby Vision.',
    warrantyInfo: '2-Year Official Hisense Kenya Warranty',
    category: 'TVs',
    keyFeatures: ['AI 4K Upscaling', 'Dolby Vision'],
    technicalSpecs: { 'Resolution': '4K UHD', 'Smart OS': 'VIDAA' },
    gbpReviews: [],
    realWorkImages: []
  },
  {
    id: 'h-u8k-75',
    name: 'Hisense 75" U8K Mini-LED 4K Smart TV',
    slug: 'hisense-75-u8k-mini-led',
    price: 185000,
    brand: 'Hisense',
    image: 'https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&q=80&w=1200'],
    description: 'Top Mini-LED TV. Unmatched brightness.',
    warrantyInfo: '2-Year Official Hisense Kenya Warranty',
    category: 'TVs',
    keyFeatures: ['Mini-LED Technology'],
    technicalSpecs: { 'Panel': 'Mini-LED' },
    gbpReviews: [],
    realWorkImages: []
  },
  {
    id: 'app-ip15-pro',
    name: 'Apple iPhone 15 Pro (256GB) Titanium',
    slug: 'apple-iphone-15-pro-titanium',
    price: 165000,
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1200'],
    description: 'Latest iPhone 15 Pro.',
    warrantyInfo: '1-Year Official Apple Warranty',
    category: 'Phones',
    keyFeatures: ['A17 Pro Chip'],
    technicalSpecs: { 'Storage': '256GB' },
    gbpReviews: [],
    realWorkImages: []
  }
];

export const REVIEWS = [
  { id: 1, name: "David M.", rating: 5, text: "Best prices for Hisense TVs in Nairobi!", date: "2 days ago" }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Top 5 Best TVs in Kenya 2024',
    excerpt: 'Comparing budget and high-end models.',
    date: 'Dec 12, 2023',
    author: 'Smart Duka Team',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=800',
    slug: 'best-tvs-to-buy-kenya'
  }
];