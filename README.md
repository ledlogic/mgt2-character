# mgt2-character
Mongoose Traveller 2 Character Sheet

For best results, use landscape orientation at w=1120px.

To save as PDF, use the GoFullPage browser plugin to preserve image backgrounds, then print.

**Play online:** https://ledlogic.github.io/mgt2-character/

---

## Usage

1. Open `index.html` in a browser (served via GitHub Pages or local web server)
2. Select a **Campaign** from the first dropdown — derived automatically from the prefix before the colon in each character name
3. Select a **Character** from the second dropdown — filtered to the chosen campaign
4. The URL hash updates to preserve your selection across page refreshes (`#Campaign|char.json`)
5. Use the **← Select** button (bottom-right, hidden from print) to return to the character select state

---

## Character JSON format

Each character lives in `js/char/` as a `.json` file and is registered in `js/char/m2-char-list.json`.

Name format: `Campaign Name: Display Name` — the part before the colon becomes the campaign group in the dropdown; the part after is the display name shown once a campaign is selected.

---

## Printing

Use landscape orientation. The GoFullPage plugin captures the full 1080×800px page including image backgrounds for PDF output. The `← Select` button and nav bar are hidden from print via `@media print`.

---

## Version History

### 2.0 — Baseline (initial Claude session, June 2026)
First version seen in this Claude session. Existing functionality at that point:
- Single `m2-char-list.json` character registry
- Single character dropdown loaded from that list
- Character sheet renderer (`st-render.js`) with overview, characteristics, skills, armour/weapons/equipment tables, and story column
- Background image and foreground layout via `.st-page-bk` / `.st-page-ft`
- Print stylesheet (`st-print.css`)

---

### 2.1 — Traits auto-resize
**File:** `st-render.js`

Added `autoResizeOverview()` — after render, measures whether `.st-overview-traits` text overflows the fixed overview height and expands the container + shifts `.st-attributes` down to compensate.

---

### 2.2 — URL hash routing
**File:** `st-nav.js`

Added hash-based routing so selecting a character writes `#charUri` to the URL. On page load, the hash is read and the matching character is restored. Selecting the blank option clears the hash.

---

### 2.3 — Fix duplicate description section
**File:** `st-render.js`

`renderBETE()` was appending `age` and `traits` to the overview a second time after `renderOverview()` had already rendered them. Removed `age` and `traits` from the `renderBETE` array, leaving only `initial`, `credits`, and `debt` (which genuinely depend on equipment expense totals calculated in that function).

---

### 2.4 — Campaign dropdown (derived from character names)
**Files:** `st-nav.js`, `index.html`, `m2-char-list.json`

Replaced the single character dropdown with two dropdowns: Campaign and Character. Campaigns are derived automatically from the prefix before the first colon in each character name — no separate campaign registry file required. Selecting a campaign filters the character dropdown and strips the campaign prefix from displayed names. URL hash updated to compound format `#encodedCampaign|charUri`, preserving both selections across refresh.

Cold Trail in Kethara Reach characters merged into `m2-char-list.json` (previously in a separate `m2-ctkr-char-list.json` which has been removed).

---

### 2.5 — Campaign dropdown starts with "Select one..."
**File:** `st-nav.js`

Campaign dropdown now starts with a blank "Select one..." option rather than auto-selecting the first campaign on load. Hash restore only fires if a campaign is present in the hash.

---

### 2.6 — Cold Trail in Kethara Reach characters added
**Files:** `js/char/m2-ctkr-*.json`, `js/char/m2-char-list.json`

13 characters added for the *Cold Trail in Kethara Reach* SolSec scenario (Mongoose Traveller 2e):

**PCs:** Major Sera Vasiliou (Cell Commander), Tech Davi Okonkwo (Drone Operator), Agent Tomas Breckenridge (SIGINT), Tech Yuki Haramoto (Engineer), SFC Rael Mouton (Security), WO Nadia Kowalski (Field Medic)

**NPCs:** Analyst Marta Pelczar (Key NPC), Scout Emeka Osei-Bonsu (IISS), Yevgenia Marchetti-Solis (Naval Intelligence), Cmdr Raúl Ibáñez-Ochoa (Navy CO), Lieutenant Anya Voss (Marine Commander), Scout Eliška Mrazová (SHEPHERD Pilot)

All character images use `.webp` format. Names trimmed to ≤24 characters for clean display in the overview name field.

---

### 2.7 — Traits box fixed height, font shrink-to-fit
**Files:** `st-char.css`, `st-font.js`, `st-render.js`

- `.st-overview-traits` given fixed `height: 20px; overflow: hidden` so the white bounding box stays constant regardless of text length
- New `st-font.js` utility file with `shrinkToFit()` (uses `scrollHeight` vs `clientHeight` to detect overflow inside a fixed-height box) and `shrinkBlockToFit()` / `shrinkChildrenToFit()` for variable-height blocks
- `autoResizeOverview()` rewritten to use `st.font.shrinkToFit()` — steps font size from 12px down to 7px minimum until text fits inside the fixed box

---

### 2.8 — Story column shrink-to-fit
**Files:** `st-font.js`, `st-render.js`

Added `autoResizeStory()` called after `removeClass("st-initial-state")` makes the page visible (critical — `getBoundingClientRect()` returns zero on `display:none` elements). Shrinks all value text in the story column (background, education, terms, contacts, interactions) proportionally from 10px down to 6px minimum using `getBoundingClientRect()` for page-relative measurement.

---

### 2.9 — Back button + browser back support
**Files:** `st-nav.js`, `st-render.js`, `st-char.css`

- `hashchange` event listener added to `st-nav.js` — browser back/forward now correctly restores or clears the character selection
- `renderBackButton()` added to `st-render.js` — appends a `← Select` button (fixed position, bottom-right) after each character render. Uses Bootstrap's `hidden-print` class so it does not appear in print/PDF output
- Button styled in `st-char.css` using the existing dark/orange colour scheme

---

### 2.10 — Nav font size increase
**File:** `st.css`

Nav bar label and select font size increased from 12px to 15px.

---

## File structure

```
index.html                    — Main page; nav dropdowns + character sheet container
css/
  st/
    st.css                    — Nav bar and page layout styles
    st-char.css               — Character sheet component styles
    st-print.css              — Print overrides
js/
  st/
    st.js                     — Core namespace and logging
    st-characteristics.js     — Characteristic DM lookup
    st-char.js                — Character loader (loadChar, hideChar)
    st-nav.js                 — Campaign/character dropdowns, hash routing
    st-font.js                — Font shrink-to-fit utilities
    st-render.js              — Full character sheet renderer
  char/
    m2-char-list.json         — Master character registry (all campaigns)
    m2-ctkr-*.json            — Cold Trail in Kethara Reach characters
    [other campaign chars]
```

---

## License

MIT © 2023 Jeff Conrad
