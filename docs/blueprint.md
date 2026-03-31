# RightBricks Blueprint (Phases 1-8)

## 1) Product strategy
### Vision
RightBricks is a Cambodia-first, trust-first property marketplace + SaaS workflow platform that helps buyers and renters discover quality inventory while enabling sellers, landlords, developers, and partners to market listings, manage leads, and close transactions with transparent, trackable workflows.

### Personas & JTBD
- Buyer/Renter: find relevant listings fast, compare options, book viewings safely.
- Seller/Landlord: publish credible listings, track leads and offers, reduce friction.
- Developer: market projects, manage units, qualify demand.
- Agent Partner: handle portfolio listings and lead workflow in one panel.
- Ops/Admin: moderate content, enforce quality, manage areas/pricing, audit system activity.

### MVP Inclusions
- Public portal (home, search, detail, pricing, sell/landlord pages)
- Auth + role-aware dashboard shells (seller + admin)
- Listing CRUD lifecycle with moderation state
- Lead capture + pipeline status
- Offer tracking baseline
- SEO area + listing architecture
- Containerized production deployment

### MVP Exclusions
- In-app chat real-time websocket
- Full payment processing automation
- AI valuation engine
- Multi-language runtime localization (foundation only)

### Monetization
1. Listing packages (self-serve).
2. Subscription tiers for landlords/partners.
3. Premium placement/featured listings.
4. Future transaction facilitation and B2B tools.

### Key Trust Mechanisms
- Verified listing badges + moderation queue
- Clear ownership identity and KYC status
- Audit logs for admin actions
- Transparent pricing and package comparison

### Major risks
- Thin listing inventory at launch.
- Duplicate/faceted SEO dilution.
- Spam and fraudulent inquiry risk.
- Over-building before PMF.

## 2) Stack and architecture decision
- Next.js App Router + TypeScript + Tailwind + Zod + Prisma.
- PostgreSQL primary DB, Redis for queue/cache.
- Caddy reverse proxy with automated TLS.
- Docker Compose single-VPS topology with clean migration path to managed DB/object storage.
- Server actions + route handlers first; extract services later if scale mandates.

## 3) Sitemap (complete high-level)
- Public: `/`, `/buy`, `/rent`, `/sell`, `/landlords`, `/developers`, `/pricing`, `/about`, `/contact`, `/how-it-works`, `/areas`, `/areas/:city`, `/areas/:city/:district`, `/blog`, `/blog/:slug`, `/legal/privacy`, `/legal/terms`, `/auth/login`, `/auth/register`, `/properties/:slug`, `/search`, `/compare-packages`, `/request-valuation`
- Dashboard: `/dashboard`, `/dashboard/listings`, `/dashboard/listings/new`, `/dashboard/listings/:id/edit`, `/dashboard/leads`, `/dashboard/viewings`, `/dashboard/offers`, `/dashboard/documents`, `/dashboard/billing`, `/dashboard/settings`, `/dashboard/verification`, `/dashboard/support`, `/dashboard/notifications`
- Admin: `/admin`, `/admin/users`, `/admin/listings`, `/admin/leads`, `/admin/agents`, `/admin/areas`, `/admin/content`, `/admin/pricing`, `/admin/analytics`, `/admin/audit-logs`, `/admin/support`, `/admin/settings`

## 4) Domain model overview
Core entities: User, Profile, Listing, ListingMedia, Lead, Offer, Area, Notification, AuditLog (+ future: Viewing, Subscription, Invoice, SEOPage, BlogPost, SupportTicket).

State machines:
- Listing: `DRAFT -> SUBMITTED -> UNDER_REVIEW -> PUBLISHED -> PAUSED/ARCHIVED` and `REJECTED` branch.
- Lead: `NEW -> CONTACTED -> QUALIFIED -> VIEWING_BOOKED -> OFFER_MADE -> CLOSED_WON/CLOSED_LOST`.

## 5) SEO architecture
- Indexable templates: city pages, district pages, intent pages (buy/rent), canonical property pages, editorial content.
- Canonical policy: only core sort for indexable search combinations; faceted combinations default noindex,follow.
- Schema: Organization, BreadcrumbList, RealEstateListing (via Product/Offer model), FAQ, BlogPosting.
- Sitemaps: segmented (`sitemap-static.xml`, `sitemap-areas.xml`, `sitemap-listings.xml`, `sitemap-blog.xml`).

## 6) Contabo deployment approach
- Single VPS: `proxy + web + db + redis + backup` via Docker Compose.
- Security: UFW (22/80/443), fail2ban, SSH key-only, non-root deploy user.
- Backups: nightly PG dump container + weekly offsite sync.
- Observability: structured app logs + uptime checks + error tracking.

## 7) Phased roadmap (12 weeks)
- W1-2: foundation, auth, schema, infra.
- W3-4: listing CRUD + media + moderation.
- W5-6: search, PDP, SEO templates.
- W7-8: seller dashboard flows (leads/offers/viewings placeholders).
- W9-10: admin ops, audit logs, content tooling.
- W11: hardening, analytics, CWV.
- W12: launch prep, data seeding, runbooks.
