# Smart Duka Electronics — Shopify High-Performance Theme

## Project Overview
This is a premium, high-conversion Shopify Theme structure designed specifically for the Kenyan electronics market. It features a custom React-based "Retail Engine" that handles the high-end interactive catalog, professional installation booking, and real-time delivery tracking.

## Shopify Directory Structure
- `/assets`: Contains `smart-duka-app.js` (React Logic), `smart-duka-init.js` (Global Config), and CSS.
- `/layout`: Contains `theme.liquid` (The master layout).
- `/templates`: Contains `index.liquid` (Homepage) and `page.smart-duka.liquid` (Custom landing pages).
- `/snippets`: Contains modular Liquid components for Shopify integration.

## Installation Instructions
1. **Upload Assets**: Upload all files in the `/assets` folder to your Shopify Admin under *Online Store > Themes > Edit Code > Assets*.
2. **Configure Layout**: Replace your `layout/theme.liquid` with the provided file.
3. **Set Template**: Ensure the Homepage uses the provided `templates/index.liquid`.
4. **API Keys**: In `assets/smart-duka-init.js`, ensure your Supabase and Gemini API keys are configured for the live environment.

## Retail Terminology Mapping
- **"Asset Acquisition"** → **"Purchase"**
- **"Dossier"** → **"Order Details"**
- **"Vault"** → **"Full Catalog"**
- **"Mission Control"** → **"Business Manager"**

## Developer Notes
The app uses a `HashRouter` to prevent conflicts with Shopify's internal routing. All product data in the demo is stored in `smart-duka-init.js` but can be dynamically linked to the Shopify `collections.json` API.
