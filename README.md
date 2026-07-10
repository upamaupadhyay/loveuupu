# To My Forever Fairytale 💜
### A birthday website for Uppu — built in 4 phases

This is a complete, ready-to-use website. It works immediately by just opening
`index.html` in a browser — no installation, no build tools, nothing to compile.

---

## What's inside

```
uppu-fairytale/
├── index.html          <- the whole site (all 15 chapters/scenes)
├── css/style.css        <- purple theme, all animations
├── js/script.js          <- all interactivity (navigation, game, countdown, letter...)
├── assets/
│   ├── photos/           <- put your photos here (see assets/photos/README.txt)
│   ├── music/             <- background + song audio (see assets/music/README.txt)
│   └── voice/              <- your voice note (see assets/voice/README.txt)
└── README.md            <- this file
```

## The four phases (what was built)

**Phase 1 — Foundation**
Purple/lavender/gold theme, custom typography (Playfair Display, Cormorant
Garamond, Caveat handwriting font, Quicksand body), the animated starfield +
drifting petals canvas background, cursor glow trail, scene-based navigation
system with progress dots, and the cinematic opening sequence.

**Phase 2 — Story chapters**
All ten story chapters from your brief, each with typed-in story lines and
transitions: the Tea Date, "Once upon a company," the tappable reasons-I-love-you
hearts, the Fairytale song chapter, the morning-walks promise, the birthday cake
with blowable candles (tap OR blow into your mic — both work), the wedding
countdown, the tappable dream-house rooms, and the promises sequence.

**Phase 3 — Gallery, music, countdown & hidden surprises**
The Memory Wall (photos hang like polaroids, tap to reveal the caption/memory),
the "Catch the Hearts" mini-game, a live countdown to 26 November 2026, the
background-music toggle button, and the hidden secret: **tap the moon 🌙 in the
top-left corner at any time** for a private message.

**Phase 4 — Final letter, voice message, optimization & deployment**
The sealed envelope → wax seal → your full handwritten-style letter that types
itself onto the screen, the closing sequence ("I loved you yesterday... I love
you today... I'll love you forever"), a tap-to-play voice message button, and
this deployment guide below. The site is fully responsive (tested at mobile
widths), respects reduced-motion settings, and has no dead links or console
errors.

---

## Step 1 — Photos & music: already done ✅

All 11 of your photos and both songs (Jugjugjiya as the background music, and
Alexander Rybak's Fairytale for the "play our song" moment) are already in
place and wired up. You don't need to do anything here unless you want to
swap something — see `assets/photos/README.txt` and `assets/music/README.txt`
for how.

The only thing still missing is a short voice note from you for the very
final screen — see `assets/voice/README.txt` (optional; the site works fine
without it, the button just won't play anything until you add one).

## Step 2 — Preview it on your own computer

**Easiest way:** just double-click `index.html`. It opens in your browser and
works fully (some browsers restrict autoplay audio until you interact once —
totally normal, tap the music note button).

**Better way (avoids any browser file-permission quirks):**
1. Install [VS Code](https://code.visualstudio.com/) and its "Live Server"
   extension, right-click `index.html` → "Open with Live Server". *Or:*
2. If you have Python installed, open a terminal in this folder and run:
   ```
   python3 -m http.server 8000
   ```
   then visit `http://localhost:8000` in your browser.

## Step 3 — Deploy it online for free, get a shareable link

The simplest option — **Netlify Drop** (no account needed to try, free account
to keep the link permanent):
1. Go to https://app.netlify.com/drop
2. Drag the whole `uppu-fairytale` folder onto the page.
3. You instantly get a free link like `https://random-name-123.netlify.app`.
4. (Optional) Create a free Netlify account to rename the link to something
   like `https://uppu-forever.netlify.app` and keep it live permanently.

**Alternative — Vercel:**
1. Go to https://vercel.com and sign up free.
2. Click "Add New Project" → "Deploy" → drag and drop the folder (or connect
   a GitHub repo if you push this folder there first).
3. You get a link like `https://uppu-fairytale.vercel.app`.

**Alternative — GitHub Pages** (if you already use GitHub, like
github.com/damriteshwar):
1. Create a new repository, e.g. `uppu-fairytale`.
2. Upload all these files to it.
3. Go to Settings → Pages → set source to the `main` branch, root folder.
4. Your site will be live at `https://damriteshwar.github.io/uppu-fairytale`.

Any of these takes under 5 minutes and costs nothing.

## Step 4 — Send it to her

Once deployed, just send her the link — over text, WhatsApp, or however feels
right. If you want a physical touch too, you can generate a free QR code for
the link at https://www.qr-code-generator.com and print it on a card, so she
can scan it and watch it open on her own phone.

---

## Personalizing further

- **Change any text:** open `index.html`, all the copy is plain readable text
  inside the `<section class="scene">` blocks — search for the chapter you
  want to edit and change the words directly.
- **Add more memory photos or reasons-I-love-you cards:** open `js/script.js`,
  look for the `memories` array (around line 60) or the `reasons` array
  (around line 45), and add more entries following the same pattern.
- **Change the wedding date:** in `js/script.js`, search for
  `new Date('2026-11-26T00:00:00')` and update it if needed.
- **Colors:** all colors are defined once at the top of `css/style.css` under
  `:root { ... }` — change `--violet`, `--lavender`, `--gold` etc. to retheme
  the whole site instantly.

---

Made with 💜 for Uppu's birthday, and for the fairytale still being written.
