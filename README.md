# Forma — Digital Products Store

Responsive storefront + Supabase database/Auth/private Storage + Dodo hosted redirect checkout + Netlify hosting.

## Connected resources
- Supabase ref: qpvnfpbzhrszhgukmqpb
- Netlify site: iridescent-lolly-7568d0
- GitHub: popsiles/digisell

## Secure configuration required
The existing Supabase Edge Function `store-api` expects these **Supabase Edge Function secrets**:
- `DODO_PAYMENTS_API_KEY` — use your Dodo **test** API key first.
- `DODO_ENVIRONMENT` — `test_mode` while testing; `live_mode` only after verification.
- `DODO_WEBHOOK_SECRET` — signing secret from Dodo.
- Optional email: `RESEND_API_KEY`, `EMAIL_FROM`.

Supabase automatically supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions. Never add the service-role key to browser code.

## Required dashboard steps
1. In Supabase, open **Edge Functions → Secrets** and add the three Dodo secrets above.
2. In Dodo test mode, create a webhook pointing to `https://qpvnfpbzhrszhgukmqpb.supabase.co/functions/v1/store-api/webhook`. Subscribe to payment succeeded, failed, cancelled and refund succeeded. Copy its signing secret into `DODO_WEBHOOK_SECRET`.
3. In Netlify, set build variables:
   - `VITE_SUPABASE_URL=https://qpvnfpbzhrszhgukmqpb.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=<sb_publishable key>`
4. In Supabase **Authentication → URL Configuration**, set Site URL to the Netlify domain and add it to the allowed redirect URLs.
5. The administrator allowlist was populated using the email of the connected Netlify owner. Sign in with that same email; all other emails are denied.
6. Redeploy after setting the Netlify variables.

## Local development
```bash
npm install
cp .env.example .env
npm run dev
```

## Netlify build
Build command: `npm run build`; publish directory: `dist`. The repo includes `netlify.toml`.

## Test before launch
- Create/edit/delete products and upload a product image and private download file.
- Test checkout in Dodo test mode.
- Confirm a pending order does not become paid when only the success URL is opened.
- Confirm signed webhooks trigger server-side payment retrieval and update orders.
- Confirm duplicate webhooks are idempotent.
- Confirm paid orders can download and pending/failed orders cannot.
- Test mobile/tablet/desktop layouts.

## Notes
- Product prices come from the database on the server, never from the browser.
- Product files are in the private `product-files` bucket; only the backend issues short-lived signed download URLs for paid orders.
- Images are in the public `product-images` bucket.
- Email delivery requires a Resend API key and verified sender.
- Validate the installed Dodo SDK's product-sync methods and exact event payloads against the merchant account before going live.


## Separate private admin site
The public storefront build only contains `index.html` and the public Store component. It has no administrator route, login link or admin bundle. Build the private admin app separately with `npm run build:admin`; publish directory is `admin-dist`. Use a second Netlify site connected to this same GitHub repository, with build command `npm run build:admin` and publish directory `admin-dist`. Its URL is independent of the storefront. Add the private admin site's URL to Supabase Auth's allowed redirect URLs. Only the email in the private Supabase admin allowlist receives admin permissions.
