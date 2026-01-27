/**
 * Smart Duka Electronics - Shopify Initialization
 * Contains global pricing engines, retail labels, and branding constants.
 */

window.SMART_DUKA_SETTINGS = {
    SITE_NAME: "Smart Duka Electronics",
    EMAIL_SUPPORT: "smartdukakenya@gmail.com",
    WHATSAPP_CONTACT: "254742721309",
    CURRENCY: "KSh",
    
    // Service Pricing Engine (Professional Installation)
    PRICING: {
        LABOR_BASE: 1500,
        TRANSPORT_HUB_FEE: 200,
        ADDONS: {
            TV_BRACKET_FIXED: 1000,
            TV_BRACKET_SWIVEL: 2500,
            SOUNDBAR_SETUP: 1000,
            AMBIE_LIGHTS: 1300
        }
    },

    // Retail Purification Labels
    LABELS: {
        BUY_NOW: "Complete Purchase",
        ORDER_TRACKING: "Delivery Status",
        CATALOG: "Store Catalog",
        ACCOUNT: "Member Profile",
        HISTORY: "Order History",
        INVOICE: "Warranty Certificate"
    }
};

console.log("Smart Duka Retail Engine Initialized for Shopify.");