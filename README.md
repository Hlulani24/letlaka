# Letlaka Clothing — Website

**Going live? Follow `GO-LIVE.md`.**

React + Vite + Tailwind. Enquiry-and-quote site (no payment gateway).
Pages: Home · Collections (22 pieces, filters, search, product viewer) · Lookbook ·
Custom Orders (quote form) · About · Contact.

## Run it

Needs Node 18+ (https://nodejs.org). From the folder that contains `package.json`:

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build into dist/
```

Works straight away with no setup. Forms open a pre-filled WhatsApp message
until Supabase / EmailJS are connected (below).

## Basket (how customers order)

No payment. Customers open a product, choose **colour, size and quantity**, and **Add to basket**.
The basket (bag icon, top right) lists everything with prices and an estimated total, survives a refresh,
and turns into one **quote request** (name + phone). It appears under **Admin → Orders** with a table of
items, and the customer can also send the same list on WhatsApp. "Custom orders" stays for bespoke designs.
Sizes per product are set in the product editor (ticking none uses sensible defaults).

## Admin panel (edit products, prices, specials, photos, enquiries)

Open `/#/admin` (footer → "Staff login").

**Demo mode (default, no setup):** nothing is connected, so edits are saved in *this browser only*.
Sign in with passcode `letlaka-demo` (change via `VITE_ADMIN_DEMO_PASSCODE`). Use it to try the whole
flow: add/edit products, set a sale price (it appears under **Specials**), upload photos, hide items,
and see test enquiries arrive in the inbox. "Reset demo data" restores the starter catalogue.
Prices in the starter catalogue are **dummy ZAR figures** — swap them before going live.

**Live mode:** add the Supabase keys (below). The panel then uses real email/password sign-in and saves
to the database (photos go to Cloudinary), so edits appear for every visitor instantly.

| To change…                              | Where                                  |
| --------------------------------------- | -------------------------------------- |
| Products, prices, specials, photos      | Admin → Products                       |
| Basket orders, custom orders, messages  | Admin → Orders / Custom orders / Enquiries |
| Change password, sign out               | Admin → Settings                       |
| Phone numbers, WhatsApp, Instagram, FB  | `src/config.js`                        |
| Hide all prices (quote-only)            | `SHOW_PRICES = false` in `src/config.js` |
| Hide the "Concept design" tags          | `SHOW_CONCEPT_TAGS = false`            |
| Story / timeline / values copy          | `src/pages/About.jsx`                  |
| Colours / fonts                         | `tailwind.config.js`, `index.html`     |

## Deploy on Render (static site)

1. Push this folder to a GitHub repo (`.env` is git-ignored; never commit it).
2. Render → **New → Blueprint** → pick the repo. `render.yaml` sets everything up
   (build `npm install && npm run build`, publish `dist`). Or New → Static Site with those two values.
3. In the service → **Environment**, add every key from `.env.example`
   (Supabase, EmailJS, Cloudinary). Don't set `VITE_ADMIN_DEMO_PASSCODE` in production.
4. Deploy. Keys prefixed `VITE_` are baked in at build time, so **redeploy after changing any of them**.

**Cloudinary:** Settings → Upload → *Add upload preset* → name `letlaka_products`, signing mode **Unsigned**,
folder `letlaka`. Put the cloud name + preset in the env vars. Admin photo uploads go there.

## Install size

`npm install` ≈ **98 MB** on disk in `node_modules` (≈ 29 MB download, cached afterwards).
Project files ≈ 4 MB (mostly photos). The production build (`dist/`) ≈ 4 MB; the JavaScript a visitor
downloads is ≈ 136 KB gzipped. `node_modules` is never uploaded to hosting.

## Please confirm with the client

- **Instagram handle** — the card reads "@LETLAKA CLOTHING"; the site uses `@letlakaclothing`.
- **WhatsApp number** — set to +27 67 774 5340. Switch in `config.js` if the other line is the WhatsApp one.
- **Facebook link** — currently a search link; replace with the page URL.
- **Prices** — dummy demo prices. Client to supply real ones (edit in Admin).
- **Concept designs** — the knitwear, kit, polos, most tees and caps look like design mock-ups,
  so they carry a "Concept design" tag. Remove the tag once real stock photos exist.
- **Club crest** — the match-kit jersey photo shows a third party's crest ("JV Falcons").
  Get their OK to show it publicly, or swap the photo.
- **About page text** is placeholder copy — replace with the founder's own story.

## Go live — Supabase + EmailJS + Cloudinary + Render

Use **new** accounts/projects for this client. Do the steps in order (≈ 30 minutes).

### 1. Supabase (database + admin login)
1. New project. *SQL Editor* → paste `supabase/schema.sql` → Run.
2. *Authentication → Users → Add user*: the owner's email + a strong password (tick "auto confirm").
3. SQL Editor: `insert into public.admins (email) values ('owner@their-email.com');`
4. *Authentication → Providers → Email*: **turn off "Allow new users to sign up"**.
5. *Project Settings → API*: copy **Project URL** and the **anon public** key.

### 2. Cloudinary (product photos)
1. Create a free account; note the **Cloud name** on the dashboard.
2. *Settings → Upload → Upload presets → Add*: name `letlaka_products`, **Signing mode: Unsigned**,
   folder `letlaka`, allowed formats `jpg,png,webp`, and (optional) a max file size.
3. Note: unsigned uploads can't be deleted from the site. Removing a photo in the admin only unlinks it;
   tidy unused ones in Cloudinary's Media Library now and then.

### 3. EmailJS (email alerts)
1. Add an email service (Gmail etc.) → note the **Service ID**; *Account* → **Public key**.
2. Two templates → note their IDs.
   - Custom order: `{{name}} {{org}} {{phone}} {{email}} {{item}} {{qty}} {{colours}} {{needs}} {{deadline}} {{notes}}`
   - Contact: `{{name}} {{phone}} {{message}}`
3. Set "To email" in each template to the address that should receive leads.

### 4. Render (hosting)
1. Push this folder to a **private GitHub repo** (`node_modules`, `dist` and `.env` are already git-ignored).
2. Render → *New → Blueprint* → pick the repo. `render.yaml` creates a free **Static Site**.
3. Fill in the environment variables it asks for:

| Variable | From |
| --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Supabase step 5 |
| `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary (`letlaka_products`) |
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, `VITE_EMAILJS_ORDER_TEMPLATE_ID`, `VITE_EMAILJS_CONTACT_TEMPLATE_ID` | EmailJS |

4. Deploy. Variables are baked in at build time, so **after changing any, click "Clear build cache & deploy"**.
5. Open `https://<name>.onrender.com/#/admin`, sign in with the Supabase user, then
   Products → **Load starter catalogue** once to copy the demo products into the database.
6. Optional: *Settings → Custom Domains* to use the client's own domain.

For local testing: `cp .env.example .env`, fill in the same values, `npm run dev`.
With no keys the site runs in demo mode and forms fall back to WhatsApp.

## Project layout

```
public/images/          product & brand photos
render.yaml             Render deployment blueprint
src/config.js           brand details, contacts, switches
src/data/products.js    starter catalogue + lookbook
src/lib/                router, data store, photo upload (Cloudinary), form submission (Supabase + EmailJS)
src/components/         NavBar, Footer, ProductCard, ProductModal, admin/…
src/pages/              Home, Collections, Lookbook, CustomOrder, About, Contact, Admin
supabase/schema.sql     database + security rules
```
