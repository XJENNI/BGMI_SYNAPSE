# Agent instructions (Synapse26)

Goal: Make site stable on low-end Android + iOS Safari, mobile-first.
Do not hide content by default. Animations must be progressive enhancement.

Rules:
- Prefer simple CSS. Avoid backdrop-filter on mobile; avoid fixed backgrounds on mobile.
- No infinite animations on mobile; respect prefers-reduced-motion.
- Reduce JS work on load; no long tasks.
- Optimize LCP: prioritize hero content; compress images; avoid render-blocking CSS/JS.
- Accessibility: semantic headings, button labels, focus visible, color contrast.
- SEO: correct titles/meta, canonical, sitemap/robots if needed.
- Provide a PR with a checklist + before/after Lighthouse scores (mobile).
