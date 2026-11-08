# Prylora

## Website
- Store: https://prylora.netlify.app
- Admin login: https://prylora.netlify.app/admin
- The store has no admin button or admin link. Open the admin URL directly.
- Admin code is lazy-loaded only on the /admin route. Security does not rely on hiding this route: Supabase Auth, the admin allowlist, row-level security, storage policies and server-side checks protect administrator actions.

## Backend
Supabase project: qpvnfpbzhrszhgukmqpb.
Edge Function: store-api.
Webhook URL: https://qpvnfpbzhrszhgukmqpb.supabase.co/functions/v1/store-api/webhook

The product catalogue, orders, administrator allowlist and private download files are stored in Supabase. Digital files stay in the private product-files bucket. A download link is created only after a paid order is verified.

## Administrator account
The one permitted admin address is stored in the private Supabase allowlist. First-time login at /admin uses the Create admin account option; set a personal password there. Supabase sends an email-confirmation link. After confirming, return to /admin and sign in with that email/password.
Only this allowlisted email can enter the admin dashboard. Never store the password in source code or commit it to GitHub.

## One remaining Supabase Auth setting
In Supabase Dashboard → Authentication → URL Configuration, add this exact redirect URL:
https://prylora.netlify.app/admin
Keep the existing Site URL set to:
https://prylora.netlify.app

## Dodo Payments — still requires the owner's private keys
The Dodo API key and webhook signing secret have not been configured in Supabase. Do not put them into GitHub or the website code.
In Dodo Dashboard, switch to Test Mode and create a fresh API key. Add these secrets in Supabase Dashboard → Edge Functions → Secrets:
- DODO_PAYMENTS_API_KEY = your fresh Dodo test API key
- DODO_ENVIRONMENT = test_mode
- DODO_WEBHOOK_SECRET = your Dodo webhook signing secret

Register the webhook URL above and subscribe to payment.succeeded, payment.failed, payment.cancelled and refund.succeeded. The backend verifies the webhook signature with the Dodo SDK and independently retrieves successful payments before unlocking downloads.
Payments remain unavailable until the Dodo secrets and webhook have been configured. The old API key was pasted into chat earlier: revoke it and use a new key.

## SEO and app details
The build creates /sitemap.xml automatically and includes every published product URL. /robots.txt blocks admin indexing. The app manifest and SVG favicon are in /public. Add https://prylora.netlify.app/sitemap.xml to Google Search Console after the site is ready.

## Build
Netlify uses npm run build and publishes dist. GitHub Actions checks the Vite build and sitemap generation on every push.
