# SYNAPSE MAMC BGMI 2026 — MAVERICKS x SYNAPSE

A modern, cyberpunk-inspired static site for the MAVERICKS x SYNAPSE BGMI Tournament (MAMC 2026).

This repository contains a lightweight, fast, and accessible static site built with plain HTML, CSS, and JavaScript. The site features:

- Eye-catching hero with animated character renders and glow effects ✨
- Animated header, floating logos, and neon-style hover states 🔮
- Resilient image fallbacks and lazy-loading for reliable rendering 📸
- Standings page with Day/Match filtering ("Coming Soon" state before the event) 📊
- Tournament schedule, official rules (including Mandatory POV recording), and sponsor showcase 🎯

Demo & Pages
- Live site (GitHub Pages): [to be published]

Design Notes & Animations
- CSS animations: `logo-float`, `hero-glitch`, and fade-in observers for staggered content reveal.
- Visual system inspired by the "PlayerX" cyberpunk palette (custom properties: `--accent-cyan`, `--accent-purple`, `--glow-cyan`).

Getting Started
1. Clone the repo
   ```bash
   git clone https://github.com/XJENNI/BGMI_SYNAPSE.git
   cd BGMI_SYNAPSE
   ```
2. Serve locally (any static server):
   ```bash
   npx http-server . -p 8080
   ```

Deployment Checklist
- [ ] Replace external hero/sponsor images with optimized local files in `assets/images/`
- [ ] Run image optimization (target < 200KB per image) and add `assets/images/.gitkeep`
- [ ] Run Lighthouse audits and fix any accessibility or performance issues
- [ ] Enable GitHub Pages from the `main` branch (or CI publish step)

Contributing
- Fork the repo, create a feature branch, and open a PR. Keep styles scoped and prefer CSS variables for theme changes.

License
- CC-BY-NC (modify as needed)

Contact
- For questions or deployment help: `mavericks@mamc.edu`