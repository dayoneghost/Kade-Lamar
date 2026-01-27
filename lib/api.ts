
import { createClient } from '@supabase/supabase-js';
import { Product, Order, LiveDeliveryPing } from '../types';
import { PRODUCTS } from '../constants';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchProducts = async ({ pageParam = 0 }): Promise<{ data: Product[]; nextCursor: number | null }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const PAGE_SIZE = 12;
  const TOTAL_ITEMS = 2200; 
  const start = pageParam * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const data: Product[] = [];
  for (let i = start; i < end && i < TOTAL_ITEMS; i++) {
    const baseProduct = PRODUCTS[i % PRODUCTS.length];
    data.push({
      ...baseProduct,
      id: `${baseProduct.id}-${i}`,
      name: i < PRODUCTS.length ? baseProduct.name : `${baseProduct.name} (Batch ${Math.floor(i/12)})`
    });
  }
  return { data, nextCursor: end < TOTAL_ITEMS ? pageParam + 1 : null };
};

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    id: `ord_${Math.random().toString(36).substr(2, 9)}`,
    user_id: orderData.user_id,
    total_amount: orderData.total_amount || 0,
    status: 'pending',
    created_at: new Date().toISOString()
  } as Order;
};

export const triggerSTKPush = async (orderId: string, phone: string, amount: number) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: "STK Push Initiated" };
};

/**
 * Driver Mission Broadcasting Service
 */
export const broadcastTelemetry = async (payload: Partial<LiveDeliveryPing>) => {
  // Real-world: await supabase.from('live_delivery_pings').insert(payload);
  // Simulation: Use Broadcast channel for direct UI response
  supabase.channel(`telemetry_${payload.order_id}`).send({
    type: 'broadcast',
    event: 'ping',
    payload
  });
};

export const updateMissionStatus = async (orderId: string, status: string) => {
  // Update local simulation state or real Supabase table
  return { success: true, status };
};
