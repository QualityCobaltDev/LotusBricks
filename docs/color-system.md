# RightBricks Color System (Cambodia-Inspired)

This palette translates Cambodian national color language into a premium digital UI system: **blue-led trust**, **white-neutral clarity**, and **disciplined red accents**.

## Core scales

### Blue (primary trust)
- 50 `#eef4ff`
- 100 `#dce8ff`
- 200 `#c0d5ff`
- 300 `#95b6ff`
- 400 `#628df7`
- 500 `#2f67e0`
- 600 `#1149aa`
- 700 `#0e3d8e`
- 800 `#113470`
- 900 `#102b59`

### Red (controlled emphasis)
- 50 `#fff1f4`
- 100 `#ffe2e8`
- 200 `#ffc8d3`
- 300 `#ff9cb0`
- 400 `#f86f8e`
- 500 `#e03f67`
- 600 `#c01d49`
- 700 `#9f173d`
- 800 `#7f1736`
- 900 `#63142f`

### Neutral (canvas + readability)
- 50 `#f8f9fc`
- 100 `#f1f3f8`
- 200 `#e5e9f1`
- 300 `#d0d7e4`
- 400 `#9aa7bd`
- 500 `#687792`
- 600 `#4c5a74`
- 700 `#364259`
- 800 `#232d40`
- 900 `#131a2b`

## Semantic tokens

- `--color-primary`, `--color-primary-hover`
- `--color-secondary`, `--color-accent`
- `--color-background`, `--color-surface`, `--color-border`
- `--color-text`, `--color-text-muted`
- `--color-success`, `--color-warning`, `--color-error`, `--color-info`

## Component usage rules

- **Primary button:** blue 600 base, blue 700 hover, white text, visible focus ring.
- **Secondary button:** white/neutral background, blue border/text, blue-tint hover.
- **Accent button:** red 600/700 only for featured/promotional high-attention actions.
- **Links:** blue 700 default, blue 800 hover.
- **Badges:** verified=blue tint, featured=red tint, success=green, warning=amber, error=red, draft=neutral.
- **Cards/surfaces:** white with neutral borders and subtle shadow.
- **Forms:** neutral background with blue focus and red-only errors.
- **Navigation:** neutral/white base with blue active states.
- **Hero:** blue-led visual hierarchy with restrained red accents.
- **Footer:** deep blue base, white/neutral text, optional subtle red hover accents.

## Red usage policy

Use red for:
- featured listings
- urgent/critical states
- premium promotional emphasis

Avoid red for:
- default navigation
- long-form body text
- large layout backgrounds

## Admin alignment

Admin interfaces use the same tokens with calmer operational surfaces (`--admin-bg`, `--admin-sidebar`) while preserving blue as the primary interaction color and red for high-severity cues.
