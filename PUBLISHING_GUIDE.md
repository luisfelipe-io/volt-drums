# VOLT DRUMS — Complete Publishing Guide
## Deploy, SEO, PayPal Donations

---

## PART 1 — Deploy on Vercel (Free, ~10 minutes)

### Step 1: Create accounts (if you don't have them)
1. Go to **https://github.com** → Create free account
2. Go to **https://vercel.com** → Sign up with your GitHub account

### Step 2: Push the project to GitHub
Open a terminal in the `volt-drums` folder:

```bash
# Install dependencies (first time only)
npm install

# Initialize git repository
git init
git add .
git commit -m "Initial release — VOLT DRUMS v1"

# Create a new repository on GitHub:
# Go to https://github.com/new
# Name it: volt-drums
# Keep it Public
# Click "Create repository"

# Then connect and push (replace YOUR_USERNAME):
git remote add origin https://github.com/YOUR_USERNAME/volt-drums.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `volt-drums` repository
4. Vercel auto-detects Vite — click **"Deploy"**
5. Wait ~60 seconds → your site is live at `https://volt-drums-XXXX.vercel.app`

### Step 4: Add a custom domain (optional but recommended)
- Buy `voltdrums.com` at Namecheap (~$12/year) or Google Domains
- In Vercel dashboard → Settings → Domains → Add domain
- Follow DNS instructions Vercel gives you
- Takes 24-48h to propagate

### Step 5: Every future update
```bash
git add .
git commit -m "Update: describe what changed"
git push
# Vercel auto-deploys in ~60 seconds
```

---

## PART 2 — PayPal Donation Button Setup (~15 minutes)

### Step 1: Create a PayPal Donate Button
1. Log into your PayPal account at **paypal.com**
2. Go to: **https://www.paypal.com/donate/buttons** (or search "PayPal Donate Button")
3. Choose **"Donate"**
4. Fill in:
   - Organization name: `VOLT DRUMS`
   - Purpose: `Support VOLT DRUMS Development`
   - Currency: USD
5. Click **"Create Button"**
6. PayPal will give you HTML code like:
   ```html
   <form action="https://www.paypal.com/donate" method="post">
     <input type="hidden" name="hosted_button_id" value="ABCDEF123456">
     ...
   </form>
   ```
7. **Copy the `hosted_button_id` value** (e.g. `ABCDEF123456`)

### Step 2: Add your button ID to the project
In `src/components/Header.jsx`, find this line (appears twice — desktop and mobile):
```
href="https://www.paypal.com/donate/?hosted_button_id=REPLACE_WITH_YOUR_BUTTON_ID"
```

Replace `REPLACE_WITH_YOUR_BUTTON_ID` with your actual ID:
```
href="https://www.paypal.com/donate/?hosted_button_id=ABCDEF123456"
```

### Step 3: Push the update
```bash
git add .
git commit -m "Add PayPal donation button"
git push
```

---

## PART 3 — Google Search Console (~20 minutes)

Google Search Console tells Google your site exists and lets you monitor search rankings.

### Step 1: Register your site
1. Go to **https://search.google.com/search-console**
2. Sign in with Google account
3. Click **"Add property"**
4. Choose **"URL prefix"** → Enter: `https://voltdrums.com`
5. Click **Continue**

### Step 2: Verify ownership (via HTML tag method — easiest)
1. Google gives you a meta tag like:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXX" />
   ```
2. Open `index.html` in the project
3. Paste it inside `<head>` (after the `<title>` line)
4. Push to GitHub → Vercel redeploys
5. Go back to Search Console → click **"Verify"**

### Step 3: Submit your sitemap
1. In Search Console left menu → **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**

### Step 4: Monitor (check weekly)
- **Performance** → See which Google queries bring users
- **Coverage** → Check for errors
- Expect first results in 2-4 weeks

---

## PART 4 — File Structure Reference

```
volt-drums/                          ← root
├── index.html                       ← ★ EDIT THIS for SEO/meta tags
├── vercel.json                      ← Caching + security headers
├── vite.config.js
├── package.json
│
├── public/                          ← Static files (served as-is)
│   ├── robots.txt                   ← Tells crawlers what to index
│   ├── sitemap.xml                  ← ★ Update lastmod date each release
│   └── og-image.png                 ← ★ TODO: Create 1200×630px preview image
│
└── src/
    ├── App.jsx                      ← Root component
    ├── components/
    │   └── Header.jsx               ← ★ PayPal button is here
    ├── data/
    │   └── beatPresets.js           ← ★ Groove patterns (add more here)
    └── engine/
        └── SoundBank.js             ← ★ All drum sounds
```

---

## PART 5 — Quick SEO Checklist

Before going live, make sure:

- [ ] `index.html` has proper `<title>` and `<meta description>` in English
- [ ] `public/robots.txt` exists with correct domain
- [ ] `public/sitemap.xml` exists with correct domain and today's date
- [ ] `public/og-image.png` created (1200×630px) — shows when shared on social
- [ ] Google Search Console registered and sitemap submitted
- [ ] PayPal button ID replaced in `Header.jsx`

### Creating og-image.png (simple option):
- Go to **canva.com** → Create design → 1200×630px
- Dark background, "VOLT DRUMS" text, a drum icon
- Download as PNG → save to `public/og-image.png`

---

## PART 6 — Launch Promotion (Free Channels)

Post on these platforms on launch day:

### Reddit (most impactful):
- **r/WeAreTheMusicMakers** — post: "I built a free professional virtual drum kit that runs in your browser"
- **r/drums** — drummers who'll appreciate the kit variety
- **r/webdev** — developers who'll appreciate the tech
- **r/InternetIsBeautiful** — general audience, high traffic

### ProductHunt:
- Submit at **https://www.producthunt.com/posts/new**
- Schedule for Tuesday-Thursday, 12:01 AM PST (peak traffic time)
- Title: "VOLT DRUMS — Free professional virtual drum kit in your browser"

### Twitter/X:
- Post a short video (screen recording) of you playing a groove
- Tag: #drums #webdev #musicproduction #beatmaker

---

## PART 7 — About Real Samples (For Future Reference)

When you're ready to implement real drum samples, these are 100% free and commercially usable:

### FreeSounds.org CC0 Drum Samples
- Search "drum kit CC0" or "acoustic drums CC0"
- License: CC0 = public domain, no attribution required

### DrumKits by BigMomma (freesound)
- High quality single-hit samples, CC0

### How to implement (future iteration):
```javascript
// Load sample
const response = await fetch('/samples/kick.wav')
const arrayBuffer = await response.arrayBuffer()
const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

// Play sample (replaces synthesis)
const source = ctx.createBufferSource()
source.buffer = audioBuffer
source.connect(masterBus)
source.start()
```

Samples would go in `public/samples/` and be referenced from `SoundBank.js`.
This alone would be the biggest quality improvement possible.

---

## PART 8 — My Assessment: Is it ready to launch?

**Yes — launch now, improve iteratively.**

Here's why:
1. **The sequencer is genuinely unique** — most browser drum toys don't have it
2. **5 genre-specific kits** differentiate it from competitors
3. **WAV recording** is a real feature people will use
4. **The design is professional** — it doesn't look like a toy

What you'll likely hear from early users:
- "Sounds a bit synthetic" → planned fix with CC0 samples
- "Can you add more kits?" → paid premium path
- "Can I save my patterns?" → next major feature

**Vercel free tier and PayPal donations are 100% permitted.**
Vercel's terms only restrict running server-side code that could be used for abuse. A static web app with a PayPal link is perfectly fine. The restriction on ads applies to their network/CDN being used as an ad server — not to having a donation link on your site.
