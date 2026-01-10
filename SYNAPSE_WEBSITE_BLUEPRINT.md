# SYNAPSE MAMC BGMI 2026 - Website Specification Document

## Project Overview
**Event Name:** Synapse MAMC BGMI Tournament 2026  
**Organizer:** MAMC (Mentioned as the host)  
**Location:** New Delhi, Delhi, India  
**Tournament Type:** BGMI (Battlegrounds Mobile India) Esports Tournament  
**Prize Pool:** ₹15,000 (Estimated)  
**Format:** Teams-based with Group Stage system (4 Groups: A, B, C, D)  
**Website Type:** Static HTML/CSS/Vanilla JS (No frameworks)

---

## Website Architecture

### Pages (4 Total)
1. **index.html** - Landing/Home Page
2. **standings.html** - Live Leaderboard with Filters
3. **schedule.html** - Match Timeline & Rules
4. **watch.html** - Stream Embed & Community

### Folder Structure
```
synapse-bgmi-website/
├── index.html
├── standings.html
├── schedule.html
├── watch.html
├── assets/
│   ├── css/
│   │   ├── style.css (Main theme - PlayerX style)
│   │   ├── responsive.css (Mobile breakpoints)
│   │   └── custom.css (Color overrides: Cyan/Gold)
│   ├── js/
│   │   ├── main.js (Global nav, preloader, animations)
│   │   └── standings.js (Leaderboard logic & JSON fetch)
│   ├── images/
│   │   ├── logo.png (SYNAPSE/MAMC logo)
│   │   ├── hero-bg.jpg (Hero background image)
│   │   ├── sponsor-*.png (3x sponsor logos)
│   │   └── favicon.ico
│   └── fonts/
│       └── (Google Fonts: Rajdhani, Inter)
├── data/
│   └── standings.json (16 teams with group, kills, points)
├── template/ (Reference - DO NOT DEPLOY)
│   └── (PlayerX original files for reference)
└── .github/
    └── copilot-instructions.md (Agent guidelines)
```

---

## Visual Design System

### Color Palette
| Name | Hex | Usage | RGB |
|------|-----|-------|-----|
| **Background** | #000000 | Page background | 0, 0, 0 |
| **Surface Dark** | #0f0f1a | Cards, sections | 15, 15, 26 |
| **Primary Accent** | #00f0ff | Buttons, borders, hover | 0, 240, 255 |
| **Secondary Accent** | #bc13fe | Text shadow, alt borders | 188, 19, 254 |
| **Gold** | #ffd700 | Rank #1, special highlights | 255, 215, 0 |
| **Text Primary** | #ffffff | Main text | 255, 255, 255 |
| **Text Secondary** | #b0b0b0 | Muted text | 176, 176, 176 |
| **Danger** | #ff0055 | Errors, alerts | 255, 0, 85 |
| **Success** | #00ff88 | Confirmations | 0, 255, 136 |

### Typography
**Heading Font:** Rajdhani (Google Fonts, Weight 700, Italic)  
**Body Font:** Inter (Google Fonts, Weight 400)  
**Monospace:** 'Monaco' or system monospace (for kill counts/scores)

### Design Style: PlayerX Theme
- **Aesthetic:** Aggressive, Sporty, "E-Sports Tournament"
- **Shapes:** Sharp angles, skewed elements (clip-path polygons, transform: skewX())
- **Borders:** 1-2px solid with glow effects
- **Buttons:** Skewed (-20deg), shiny hover effect with sliding gradient
- **Cards:** Grayscale→Color on hover, zoom effect
- **Animations:** Scroll-triggered fade-ins, pulsing neon text, smooth transitions
- **Texture:** Dark grunge background with subtle noise overlay

---

## Page Specifications

### 1. index.html - Landing Page

#### Header/Navigation
- **Sticky:** Yes (position: sticky, top: 0)
- **Content:**
  - Logo/Brand: "SYNAPSE MAMC" (text-based, 24px Rajdhani Bold)
  - Nav Links: Home | Standings | Schedule | Watch (right-aligned)
  - Style: Black background, Cyan underline on active link
  - Mobile: Hamburger menu (icon only, toggles nav on tap)

#### Hero Section
- **Height:** 100vh (full screen)
- **Background:** 
  - Image: `assets/images/hero-bg.jpg` (BGMI gunplay / action scene)
  - Overlay: Linear gradient rgba(0, 0, 0, 0.6) to darken image
- **Content (Centered):**
  - Main Title: "SYNAPSE MAMC BGMI 2026"
    - Font: Rajdhani 80px Bold Italic
    - Color: White with text-shadow: 2px 2px 0px #bc13fe
    - Animation: Pulsing glow (keyframes: pulseGlow 2s infinite)
  - Subtitle: "POWERED BY SYNAPSE MAMC" (40px, lighter weight)
  - CTA Button: "REGISTER NOW"
    - Style: Skewed -20deg, 16px padding, Cyan background
    - Hover: Glow effect, slight scale-up
    - Click: Link to Discord or registration form (placeholder: #)

#### Ticker Bar (Top, fixed)
- **Position:** Fixed top, just below header
- **Background:** Yellow (#ffd700)
- **Text Color:** Black
- **Content:** "FREE ENTRY • ₹15K PRIZE POOL • LAN FINALS • REGISTRATION OPEN"
- **Animation:** Text scrolls horizontally continuously
- **Pattern:** Diagonal stripes (repeating-linear-gradient 45deg)

#### Highlights Section
- **3 Cards (3-column grid, responsive to 1-column mobile):**
  1. **Prize Pool**
     - Icon: Trophy emoji or icon
     - Heading: "₹15,000"
     - Subtext: "Total Prize Pool"
  2. **Schedule**
     - Icon: Calendar emoji
     - Heading: "4 Days"
     - Subtext: "Group Stage Matches"
  3. **Finals**
     - Icon: Trophy emoji
     - Heading: "LAN"
     - Subtext: "Top Teams Live"
- **Style:** Black background, Cyan border (1px with glow), hover: full color, scale 1.05

#### Sponsors Section
- **Heading:** "OUR SPONSORS" (uppercase, 32px)
- **3 Placeholder Logos (grayscale by default)**
  - Hover: Full color + scale 1.1
  - Spacing: Evenly distributed, responsive
  - Fallback: "Sponsor 1", "Sponsor 2", "Sponsor 3" (text)

#### Footer
- **Background:** #0f0f1a
- **Content (3 columns, stack on mobile):**
  1. **About:** "SYNAPSE MAMC brings esports to the community with BGMI tournaments."
  2. **Quick Links:** Home, Standings, Schedule, Watch
  3. **Follow Us:** Discord (icon link), Instagram (icon link)
- **Copyright:** "© 2026 Synapse MAMC. All rights reserved."
- **Dividers:** Thin cyan line separating columns

---

### 2. standings.html - Live Leaderboard

#### Header/Navigation (Same as index.html)

#### Page Title
- **Text:** "OVERALL STANDINGS"
- **Font:** Rajdhani 48px Bold, Cyan color

#### Filter Tabs (Horizontal Button Row)
- **Buttons:** Overall | Group A | Group B | Group C | Group D
- **Style:**
  - Default: Black background, white text, 1px border
  - Active: Cyan background, black text, scale 1.05
  - Hover: Glow effect
- **Function:** Click to filter table by group

#### Leaderboard Table
- **Columns (8 total):**
  1. Rank (1–16, right-aligned)
  2. Team Name (left-aligned, bold)
  3. Group (A/B/C/D, centered)
  4. Matches Played (centered)
  5. Total Kills (right-aligned, bright color)
  6. Placement Points (right-aligned)
  7. Kill Points (right-aligned)
  8. Total Score (right-aligned, largest font, gold for rank 1)

- **Styling:**
  - **Header Row:** Skewed background, white text
  - **Body Rows:** Black background, alternating slight transparency
  - **Rank #1:** Gold left border (3px), gold text for rank
  - **Top 3:** Cyan tint background (rgba(0,240,255,0.1))
  - **Hover Row:** Glow effect on left edge, slight scale-x
  - **Borders:** 1px solid rgba(0,240,255,0.3) between rows

- **Responsiveness (Mobile):**
  - Hide columns: Group, Placement Pts, Kill Pts (show on hover/tap)
  - Show essential: Rank, Team, Total Score, Kills

#### Auto-Refresh
- Fetch `data/standings.json` every 30 seconds
- Update table silently (no page reload)
- Show "Last Updated: HH:MM" timestamp

#### Footer (Same as index.html)

---

### 3. schedule.html - Match Timeline & Rules

#### Header/Navigation (Same)

#### Page Title
- **Text:** "TOURNAMENT SCHEDULE & RULES"
- **Font:** Rajdhani 48px Bold

#### Vertical Timeline
- **Events (4):**
  1. **Day 1 - February 6**
     - Stage: Group A & B Matches (6 matches)
     - Time: 2:00 PM - 6:00 PM
     - Maps: Erangel, Miramar
  2. **Day 2 - February 7**
     - Stage: Group C & D Matches (6 matches)
     - Time: 2:00 PM - 6:00 PM
     - Maps: Sanhok, Rondo
  3. **Day 3 - February 8**
     - Stage: Cross-Group Matches (4 matches)
     - Time: 3:00 PM - 5:00 PM
     - Maps: Erangel, Miramar
  4. **Finals - February 14**
     - Stage: Top 4 Teams (LAN Event)
     - Time: 3:00 PM
     - Location: Venue TBD

- **Visual Design:**
  - Central vertical line
  - Dates on left, match info on right (alternating)
  - Circles/diamonds on the timeline line
  - Hover: Expand to show more details

#### Map Rotation Section
- **Title:** "MAP ROTATION"
- **Icons/Names:** Erangel, Miramar, Sanhok, Rondo (displayed as cards)
- **Style:** Cyan borders, rotate on hover

#### Rules Section
- **Title:** "TOURNAMENT RULES"
- **Subsections:**
  1. **Team Format**
     - 4v4 Squad matches
     - Max 16 teams
     - Group stage → Finals
  2. **Scoring System**
     - Placement Points: 1st-4th placement
     - Kill Points: 1 point per kill
     - Total Score = Placement + Kills
  3. **Game Settings**
     - Map Rotation: As per schedule
     - Spawn: Random
     - Time Limit: 25 minutes per match
  4. **Behavior & Conduct**
     - No toxicity in chat
     - Fair play enforced
     - Admins have final say

- **Style:** Bullet-point lists, minimal styling, readable on all screens

#### Footer (Same)

---

### 4. watch.html - Stream & Community

#### Header/Navigation (Same)

#### Page Title
- **Text:** "WATCH LIVE"
- **Status Badge:** "LIVE NOW" (if streaming) or "OFFLINE" (red/green indicator)

#### YouTube Embed
- **Aspect Ratio:** 16:9 (responsive)
- **Placeholder Video ID:** (Use a sample BGMI video or your stream link)
- **Style:** Full width up to 900px, centered, Cyan border

#### Theater Mode Button
- **Function:** Toggle fullscreen or minimal UI
- **Icon:** Expand arrow
- **Position:** Top-right of video

#### Community Links Section
- **Title:** "JOIN OUR COMMUNITY"
- **Buttons (2 or 3):**
  1. **Discord** - "Join our Discord server"
     - Icon + Link
  2. **Instagram** - "Follow us on Instagram"
     - Icon + Link
  3. (Optional) **YouTube** - "Subscribe to our channel"
- **Style:** Skewed buttons, Cyan background, white text

#### Chat Placeholder (Optional)
- **Simple readonly div** showing "Chat will appear here during live"
- **Style:** Dark background, small text

#### Footer (Same)

---

## Data Structure (data/standings.json)

```json
[
  {
    "id": "team-soul",
    "rank": 1,
    "teamName": "Team Soul",
    "group": "A",
    "matchesPlayed": 6,
    "totalKills": 42,
    "placementPoints": 38,
    "killPoints": 42,
    "totalScore": 80
  }
]
```
- 16 teams total
- Ranks 1-16
- 4 groups (A, B, C, D)
- totalScore = placementPoints + killPoints

---

## Functionality Requirements

### 1. Navigation
- All pages linked correctly
- Active page highlighted in nav
- Mobile hamburger menu functional

### 2. Standings Page
- JSON loaded via fetch()
- Filter buttons work without page reload
- Table updates on filter
- Highlights render correctly
- Auto-refresh every 30 seconds

### 3. Responsive Design
- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Full-height hero on all devices
- Table scrollable on mobile
- All text readable

### 4. Accessibility
- Semantic HTML
- ARIA labels for buttons
- Focus styles (cyan outline)
- Alt text for images
- Keyboard navigation

### 5. Performance
- Images optimized (< 200KB each)
- Smooth animations (60fps)
- No render-blocking resources

---

## Deployment

### GitHub Pages
1. Push code to `main` branch
2. Settings → Pages → Deploy from `main` / `root`
3. Site URL: `https://XJENNI.github.io/bgmi-synapse/`

---

**Document Version:** 1.0  
**Last Updated:** January 10, 2026  
**Author:** Synapse Event Team + AI Development
