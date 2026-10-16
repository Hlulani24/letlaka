# Letlaka — go-live checklist (about 45 minutes)

Do the steps in this order. Keep a notepad open: you'll copy 8 keys along the way.

## 0. Before you start
- Install **Node.js 20 LTS** (nodejs.org) and **Git** (git-scm.com).
- Create free accounts: **GitHub**, **Supabase**, **EmailJS**, **Cloudinary**, **Render** (sign in with GitHub).
- Use the shop's own email for these accounts so the owner keeps control.

## 1. Test it on your computer
```bash
cd letlaka            # the folder that contains package.json
npm install
npm run dev           # open http://localhost:5173
```
Admin: http://localhost:5173/#/admin  (demo passcode `letlaka-demo`). Stop with Ctrl+C.

## 2. Push to GitHub
1. GitHub → **New repository** → name `letlaka-website` → **Private** → do NOT tick "Add a README" → Create.
2. In the project folder:
```bash
git init
git add .
git commit -m "Letlaka website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/letlaka-website.git
git push -u origin main
```
3. Check on GitHub that **`.env` is NOT in the file list** (it's git-ignored on purpose). If it is, stop and tell me.

## 3. Supabase (database + admin login)
1. supabase.com → **New project** (pick a region close to South Africa, e.g. London/Frankfurt). Save the database password.
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. Run this once more with the owner's real email (the one they'll sign in with):
   `insert into public.admins (email) values ('owner@example.com') on conflict do nothing;`
4. **Authentication → Users → Add user** → same email + a strong password → tick "Auto confirm".
5. **Authentication → Providers → Email** → turn **OFF "Allow new users to sign up"**.
6. **Project Settings → API** → copy **Project URL** and the **anon public** key.
   (Never use the `service_role` key anywhere in this site.)

## 4. Cloudinary (photo storage)
1. cloudinary.com → dashboard → copy your **Cloud name**.
2. **Settings (gear) → Upload → Upload presets → Add upload preset**
   - Name: `letlaka_products`
   - Signing mode: **Unsigned**
   - Folder: `letlaka`
   - Save.

## 5. EmailJS (new-order emails)
1. emailjs.com → **Email Services → Add service** (Gmail is easiest) → copy the **Service ID**.
2. **Email Templates → Create** two templates, each with "To email" = the shop's inbox:
   - **Orders** (used for basket orders and custom orders). Subject: `New order request from {{name}}`.
     Body can use: `{{name}} {{phone}} {{email}} {{deadline}} {{notes}} {{items}} {{total}} {{item}} {{qty}} {{colours}} {{needs}} {{org}}`
   - **Contact**. Subject: `New message from {{name}}`. Body: `{{name}} {{phone}} {{message}}`
   Copy both **Template IDs**.
3. **Account → General** → copy your **Public Key**.

## 6. Deploy on Render
1. render.com → **New → Blueprint** → connect GitHub → pick `letlaka-website` → Apply.
   (`render.yaml` creates a free static site: build `npm install && npm run build`, publish `dist`.)
2. Open the new service → **Environment** → fill in these keys:

| Key | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL from step 3 |
| `VITE_SUPABASE_ANON_KEY` | anon public key from step 3 |
| `VITE_EMAILJS_SERVICE_ID` | Service ID |
| `VITE_EMAILJS_PUBLIC_KEY` | Public key |
| `VITE_EMAILJS_ORDER_TEMPLATE_ID` | Orders template ID |
| `VITE_EMAILJS_CONTACT_TEMPLATE_ID` | Contact template ID |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `letlaka_products` |

   Leave `VITE_EMAILJS_BASKET_TEMPLATE_ID` and `VITE_ADMIN_DEMO_PASSCODE` **empty / unset**.
3. **Manual Deploy → Deploy latest commit.** (Keys are baked in at build time — redeploy after any change.)
4. Your site is at `https://letlaka-clothing.onrender.com` (or similar).
5. Supabase → **Authentication → URL Configuration** → set **Site URL** to that address
   (so "Forgot password?" emails link back correctly).

## 7. First-time setup inside the live admin
1. Go to `https://YOUR-SITE/#/admin` and sign in with the owner's email + password. The "Demo mode" banner must be gone.
2. **Products** → **Load starter catalogue**.
3. A yellow box appears: **Move all photos to Cloudinary** → click it and wait until it finishes (about a minute).
   From now on every photo lives on Cloudinary, and new uploads go there too.
4. Replace the dummy prices (they're made-up) and review the two **hidden** items (Macaw Arrow Tee, Baseball Script 18 Tee).
5. **Settings** → change the password to one only the owner knows.

## 8. Final test (do on a phone too)
- Open a product → pick colour + size → **Add to basket** → send the request.
  It should appear in **Admin → Orders** and arrive by email. Delete the test order afterwards.
- Send a message on the **Contact** page → appears in **Enquiries** + email.
- Upload one new photo on a product → it should show on the public site.

## Later: your own domain
Render service → **Settings → Custom Domains** → add `www.yourdomain.co.za` and follow the DNS instructions.
Then update the Supabase **Site URL** to the new address.

## Updating the site later
Change files → `git add . && git commit -m "what changed" && git push` → Render redeploys by itself.
Product, price and photo changes do **not** need this — use the admin panel.

## Still to confirm with the client
Instagram handle, Facebook page URL (and TikTok/YouTube links in `src/config.js` → `EXTRA_SOCIALS`),
which number is the WhatsApp line, JV Falcons crest permission, and the spelling on the hidden mock-ups.
