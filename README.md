# ⚽ Ironfield FC Website

A clean, fast, fully static website for a local amateur football club. All content is managed by editing simple JSON files — no coding required for day-to-day updates.

---

## 🗂 Project Structure

```
fc-website/
├── index.html              ← Home page
├── pages/
│   ├── about.html
│   ├── team.html
│   ├── fixtures.html
│   ├── standings.html
│   ├── news.html
│   ├── gallery.html
│   ├── join.html
│   ├── sponsors.html
│   └── contact.html
├── css/
│   └── style.css           ← All styles
├── js/
│   └── main.js             ← All JavaScript (JSON rendering, interactivity)
├── data/                   ← ✏️ EDIT THESE to update content
│   ├── players.json
│   ├── fixtures.json
│   ├── standings.json
│   ├── news.json
│   ├── gallery.json
│   └── sponsors.json
├── images/                 ← Replace placeholder SVGs with real photos
├── sitemap.xml
├── robots.txt
└── package.json
```

---

## ✏️ How to Update Content

All content that changes regularly lives in `/data/*.json`. Open the file in any text editor and save — no build step needed.

### Adding a Fixture

Open `data/fixtures.json` and add an entry to the `"upcoming"` array:

```json
{
  "id": "u4",
  "date": "2025-04-05",
  "time": "15:00",
  "home": "Ironfield FC",
  "away": "Opponent Name",
  "venue": "Ironfield Community Ground",
  "competition": "District League Div 1",
  "isHome": true
}
```

### Moving a Fixture to Results

Once played, move the fixture from `"upcoming"` to `"results"` and add scores:

```json
{
  "id": "r4",
  "date": "2025-04-05",
  "home": "Ironfield FC",
  "away": "Opponent Name",
  "homeScore": 2,
  "awayScore": 0,
  "venue": "Ironfield Community Ground",
  "competition": "District League Div 1",
  "isHome": true,
  "report": "Brief match report text here.",
  "scorers": ["Player Name 23'", "Player Name 67'"]
}
```

### Adding a News Post

Open `data/news.json` and prepend a new object:

```json
{
  "id": "n4",
  "slug": "my-post-slug",
  "title": "Post Title Here",
  "date": "2025-04-06",
  "category": "Match Report",
  "excerpt": "Short summary shown in the news card.",
  "content": "Full article text goes here. Can be as long as you like.",
  "image": "../images/my-photo.jpg",
  "author": "Club Reporter"
}
```

### Adding a Player

Open `data/players.json` and add to the array:

```json
{
  "id": 12,
  "name": "New Player",
  "number": 14,
  "position": "Midfielder",
  "age": 22,
  "photo": "../images/player-name.jpg",
  "bio": "Short player biography.",
  "stats": { "appearances": 0, "goals": 0, "assists": 0 }
}
```

### Updating the League Table

Edit `data/standings.json` — update the `"table"` array rows. Set `"highlight": true` on your own team's row.

### Adding Gallery Images

1. Add your photo to `/images/`
2. Open `data/gallery.json` and append:

```json
{
  "id": "g7",
  "type": "image",
  "src": "../images/my-photo.jpg",
  "thumb": "../images/my-photo.jpg",
  "caption": "Photo caption here",
  "date": "2025-04-06"
}
```

---

## 🚀 Deployment

### Option A — GitHub Pages

1. Push the entire project folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set **Source** to `Deploy from a branch` → `main` → `/ (root)`
4. Your site will be live at `https://yourusername.github.io/repo-name/`

> **Tip:** For a custom domain, add a `CNAME` file containing your domain name to the root folder.

### Option B — Netlify (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **Add new site → Import an existing project**
3. Connect your GitHub repository
4. Build command: *(leave blank)*
5. Publish directory: `.` (root)
6. Click **Deploy site**

Netlify will automatically redeploy every time you push to your `main` branch.

**Netlify Forms setup:**
- In your form tags, replace `action="https://formspree.io/f/YOUR_FORM_ID"` with `action="/"`
- Add `netlify` attribute to the `<form>` tag: `<form netlify name="contact" ...>`
- Remove the `data-formspree` attribute
- Netlify will automatically handle form submissions

### Option C — Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the project root
3. Follow the prompts

---

## 📬 Contact Form Setup

### Formspree (easiest)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the form ID (looks like `xabcdefg`)
3. In `pages/join.html` and `pages/contact.html`, replace `YOUR_FORM_ID` in the `action` attribute:
   ```html
   <form action="https://formspree.io/f/xabcdefg" method="POST" data-formspree>
   ```
4. Submissions will be emailed to you and visible in the Formspree dashboard

### Netlify Forms (if using Netlify)
See the Netlify deployment section above.

---

## 🖼 Adding Real Images

Replace the placeholder SVGs in `/images/` with real photos:

- `logo.svg` → Club crest (ideally SVG or transparent PNG)
- Player photos: named `player-firstname-lastname.jpg`, referenced in `data/players.json`
- News images: any descriptive name, referenced in `data/news.json`
- Gallery photos: any name, referenced in `data/gallery.json`

**Recommended image sizes:**
| Usage | Size |
|---|---|
| Player photos | 280×320px |
| News hero images | 800×400px |
| Gallery photos | 1200×900px |
| Sponsor logos | 200×80px |
| Club logo | 120×120px |

Use [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com) to compress images before uploading.

---

## 🌿 Git Branches

| Branch | Purpose |
|---|---|
| `main` | Production — what gets deployed |
| `dev` | Development — test changes here first |

**Workflow:**
```bash
git checkout dev          # work on dev branch
# make changes to JSON or HTML
git add .
git commit -m "Add April fixtures"
git push origin dev
# When ready to go live:
git checkout main
git merge dev
git push origin main      # triggers automatic redeploy on Netlify/Vercel
```

---

## ⚙️ Running Locally

```bash
# Option 1 — npm serve
npm install
npm run dev
# Open http://localhost:3000

# Option 2 — Python (no install needed)
python3 -m http.server 3000
# Open http://localhost:3000

# Option 3 — VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> ⚠️ **Important:** Open via a local server (not by double-clicking the file). The JSON fetch calls require HTTP — they won't work over `file://` protocol.

---

## 🎨 Customisation

### Club Colors

Edit the CSS variables at the top of `css/style.css`:

```css
:root {
  --green-dark: #0d1f16;   /* Dark background */
  --green: #1a3a2a;        /* Primary green */
  --gold: #c9a84c;         /* Accent gold */
  --cream: #f5f0e8;        /* Light background */
}
```

### Club Name

Do a find-and-replace for `Ironfield FC` across all HTML files.

### Contact Details

Update in `pages/about.html` and `pages/contact.html`.

### Google Maps Embed

In `pages/contact.html`, replace the `<iframe src="...">` with your own embed URL from [Google Maps](https://maps.google.com) (Share → Embed a map → Copy HTML).

---

## ♿ Accessibility

This site is built to WCAG 2.1 AA standards:
- All images have descriptive `alt` text
- Forms have labelled inputs
- Keyboard navigation supported throughout
- Focus styles visible on all interactive elements
- Colour contrast ratios pass AA requirements
- ARIA roles and live regions used appropriately

---

## 📄 License

MIT — free to use and adapt for your club.
