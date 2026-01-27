
/**
 * Simulated Safaricom Daraja API STK Push logic
 * This file represents a Next.js App Router API route.
 * Path: app/api/stkpush/route.ts
 */

import axios from 'axios';

export const POST = async (req: Request) => {
  try {
    const { phoneNumber, amount, accountReference } = await req.json();

    // 1. Validate Phone Number (must be 254XXXXXXXXX)
    const formattedPhone = phoneNumber.startsWith('0') 
      ? `254${phoneNumber.substring(1)}` 
      : phoneNumber.startsWith('+') 
        ? phoneNumber.substring(1) 
        : phoneNumber;

    // 2. Daraja Credentials (Placeholder for Sandbox)
    const shortCode = "174379"; 
    const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    // In production, use process.env for these
    // const consumerKey = process.env.MPESA_CONSUMER_KEY;
    // const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    
    // 3. Simulated Response (Daraja usually takes 2-5 seconds)
    // Here we return a successful CheckoutID simulation
    const checkoutRequestID = `ws_CO_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return new Response(JSON.stringify({ 
      success: true, 
      MerchantRequestID: "29115-346243-1",
      CheckoutRequestID: checkoutRequestID,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing"
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("STK Push Error:", error.message);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Internal Server Error",
      message: error.message 
    }), { status: 500 });
  }
};
