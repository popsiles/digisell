# Prylora

## Website
- Store: https://prylora.netlify.app
- Admin login: https://prylora.netlify.app/admin
- The store has no admin button or admin link. Open the admin URL directly.
- Admin code is lazy-loaded only on the /admin route. Security does not rely on hiding this route: Supabase Auth, the admin email allowlist, row-level security, storage policies and server-side checks protect administrator actions.

## Backend
Supabase project: qpvnfpbzhrszhgukmqpb.
Edge Function: store-api (version 5).
Webhook URL: https://qpvnfpbzhrszhgukmqpb.supabase.co/functions/v1/store-api/webhook

The catalogue, orders, administrator allowlist and private download files are stored in Supabase. Digital files stay in the private product-files bucket. A download link is created only after payment is verified.

## Administrator account
The one permitted admin address is stored in the private Supabase allowlist. First-time login at /admin uses **Create admin account**; set a personal password there. Supabase sends an email-confirmation link. After confirming, return to /admin and sign in with that email/password.
Only the allowlisted email can enter the admin dashboard. Never store the password in source code or commit it to GitHub.

## One remaining Supabase Auth setting
In Supabase Dashboard → Authentication → URL Configuration, add this exact redirect URL:
https://prylora.netlify.app/admin
Keep the existing Site URL set to:
https://prylora.netlify.app

## Dodo Payments — requires your private API credentials
The Dodo API key and webhook signing secret have **not** been configured in Supabase. Do not put them into GitHub, Netlify frontend variables, or website code.
In Dodo Dashboard, switch to **Test Mode** and create a fresh API key. Add these as private secrets in Supabase Dashboard → Edge Functions → Secrets:
- DODO_PAYMENTS_API_KEY = your fresh Dodo test API key
- DODO_ENVIRONMENT = test_mode
- DODO_WEBHOOK_SECRET = your Dodo webhook signing secret

Register the webhook URL above and subscribe to payment.succeeded, payment.failed, payment.cancelled and refund.succeeded. The backend verifies webhook signatures with Dodo's SDK and independently retrieves successful payments before unlocking downloads.
The backend is configured to use Test Mode by default, but checkout cannot work until the API key and webhook secret are installed. The old key was previously pasted into chat: revoke it and use a new key.

## SEO and app details
- https://prylora.netlify.app/sitemap.xml is generated dynamically from the currently published products.
- /robots.txt blocks the private admin route from search engines.
- The app manifest and SVG icon are in /public.
- Add the sitemap URL to Google Search Console once products are ready.

## Build
Netlify uses `npm run build` and publishes `dist`. GitHub Actions checks the app build on every push.
