# ContractorPro — Contractor Estimate & Invoice PWA

Professional contractor estimates and invoices with ZIP-code regional pricing for 14 trade types. Runs as a Progressive Web App — installable on Android and iOS.

## 🚀 Deploy to GitHub Pages (5 minutes)

### Step 1 — Create GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name it `contractorpro` (or anything you like)
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload files
Upload all files maintaining this structure:
```
contractorpro/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── data/
│   └── pricing.js
└── icons/
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-152.png
    ├── icon-180.png
    ├── icon-192.png
    └── icon-512.png
```

### Step 3 — Enable GitHub Pages
1. Go to repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `(root)`
4. Click **Save**
5. Your app will be live at: `https://yourusername.github.io/contractorpro/`

---

## 💳 Set Up Stripe Payments ($5.99/month)

1. Create a [Stripe account](https://stripe.com)
2. Go to **Products → Add Product**
   - Name: ContractorPro Monthly
   - Price: $5.99/month (recurring)
3. Go to **Payment Links → Create**
4. Select your product
5. Copy the payment link URL
6. In `js/app.js`, find this line and replace:
   ```js
   const stripeUrl = 'https://buy.stripe.com/your_payment_link_here';
   ```
   with your actual Stripe payment link

### After Payment — Activate Subscriptions
For production, set up a Stripe webhook to mark subscriptions active. For simpler deployment, users can click "Activate Demo Subscription" after paying (honor system), or you can use Stripe's hosted customer portal.

---

## 📱 Install on iPhone (iOS)
1. Open your GitHub Pages URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Scroll down → tap **Add to Home Screen**
4. Tap **Add**

## 📱 Install on Android
1. Open your GitHub Pages URL in **Chrome**
2. Tap the **⋮ menu** (three dots)
3. Tap **Add to Home screen** or **Install app**
4. Tap **Install**

---

## 🔨 Trade Types Covered

| Trade | Items |
|-------|-------|
| ⚡ Electrical | Panels, circuits, fixtures, EV chargers |
| 🔧 Plumbing | Pipes, fixtures, water heaters, drains |
| ❄️ HVAC | AC systems, furnaces, mini-splits, ductwork |
| 🏠 Roofing | Shingles, metal, flat roof, gutters, flashing |
| 🏢 Flooring | Hardwood, tile, LVP, carpet |
| 🎨 Painting | Interior, exterior, cabinets, specialty |
| 🪚 Carpentry | Trim, cabinets, doors, countertops |
| 🧱 Drywall | Hanging, taping, patching |
| ⚙️ Concrete | Flatwork, foundations, brick, stone |
| 🌿 Landscaping | Sod, irrigation, hardscaping, fencing |
| 🏚️ Insulation | Batt, blown, spray foam, crawl space |
| 🪟 Windows/Doors | Replacement windows, entry/garage doors |
| 🏘️ Siding | Vinyl, fiber cement, stucco |
| 🏗️ General | Framing, site prep, project management |

---

## 📦 Features

- ✅ **ZIP-code regional pricing** — Automatic labor & material cost adjustments for 200+ metro area ZIP prefixes
- ✅ **Estimate builder** — Full line-item editor with trade catalog quick-add
- ✅ **Invoice conversion** — One tap to convert estimate → invoice
- ✅ **Print to PDF** — Clean print stylesheet for estimates and invoices
- ✅ **Overhead & profit markup** — Configurable percentages
- ✅ **Sales tax on materials** — Separately tracked
- ✅ **Deposit tracking** — Configurable deposit %, balance due calculation
- ✅ **Company branding** — Logo, license #, payment instructions
- ✅ **Offline capable** — Works without internet after first load
- ✅ **14-day free trial** — Built-in trial gating

---

## 🛠 Tech Stack

- Vanilla JavaScript (no frameworks)
- CSS custom properties + mobile-first layout
- PWA: Service Worker + Web App Manifest
- localStorage for offline data persistence
- Stripe Payment Links for subscription billing
- GitHub Pages for hosting (free)

---

## 📁 File Reference

| File | Purpose |
|------|---------|
| `index.html` | App shell, splash screen, PWA registration |
| `css/styles.css` | All styling, print styles, responsive layout |
| `js/app.js` | All app logic: state, views, estimates, invoices |
| `data/pricing.js` | Regional ZIP multipliers + 14 trade catalogs |
| `sw.js` | Service worker for offline caching |
| `manifest.json` | PWA manifest for install capability |
| `icons/` | App icons for all platforms |

---

*Pricing data based on national construction cost averages, adjusted by regional cost-of-living multipliers. Contractors should verify local market rates.*
