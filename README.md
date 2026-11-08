# Prylora — Digital Products Store

Two separate web applications live in this repository:

- **Public storefront**: root of the repository. Build command: `npm run build`; publish directory: `dist`.
- **Private admin**: `admin-site/`. It is a separate app and a separate Netlify site. Set the Netlify site's base directory to `admin-site`, build command to `npm run build`, and publish directory to `dist`.

## Connected backend
Supabase project: `qpvnfpbzhrszhgukmqpb`

The database has products, categories, orders, administrators and webhook event tables, row-level security, public product-image storage and private product-file storage. An administrator email allowlist is stored in the private database schema.

## Important payment setup still required
The Dodo integration code is in the Supabase Edge Function named `store-api`. The Dodo **API key and webhook signing secret are not included in this repository and have not been configured here**. They must be entered as private Supabase Edge Function secrets:

- `DODO_PAYMENTS_API_KEY` — create a fresh key in Dodo **Test Mode**.
- `DODO_ENVIRONMENT` — set to `test_mode`.
- `DODO_WEBHOOK_SECRET` — copy from your Dodo webhook endpoint's signing-secret panel.

Webhook destination:
`https://qpvnfpbzhrszhgukmqpb.supabase.co/functions/v1/store-api/webhook`

Subscribe to payment succeeded, payment failed, payment cancelled and refund succeeded. Never put these secrets in GitHub, Netlify frontend variables, or browser code.

The backend defaults to Dodo's `test_mode` unless `DODO_ENVIRONMENT=live_mode` is explicitly set. Payments will not work until the missing secrets are entered and the webhook is registered.

## One-time Supabase Auth setup
In Supabase → Authentication → URL Configuration:
- Keep the public storefront domain in the allowed redirect URL list.
- Add the separate private admin site's domain (for example `https://prylora-control.netlify.app/**`) to the allowed redirect URL list.
- The exact public storefront URL is stored in `public.settings.site_url` and must be updated to the final public Netlify domain. This value controls Dodo's return URL.

Only the email already stored in the private admin allowlist can become an administrator. A non-allowlisted user may authenticate but cannot access administrator data or functions.

## Local development
Storefront:
```bash
npm install
npm run dev
```

Admin (run from the `admin-site` folder):
```bash
npm install
npm run dev
```

## Verification checklist
- GitHub Actions builds both the public storefront and the separate admin app.
- Test product create/edit/unpublish/delete and file/image uploads.
- Verify Dodo test checkout, signed webhook and server-side payment retrieval.
- Confirm pending/failed orders cannot download files.
- Confirm paid downloads use short-lived private signed URLs.
- Test both apps on mobile, tablet and desktop.

## Security boundary
The public storefront bundle does not import or route to the admin application. The admin app is built from a separate directory and published to a separate Netlify site. No admin link, login button, or admin route is present in the public store. The backend independently checks the authenticated user's administrator row for every admin operation.
