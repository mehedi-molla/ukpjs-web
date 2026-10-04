# Umarkhali Kistupur Probashi Jubo Songho

## Audit baseline (2026-09-26)

This repository is an AI Studio-generated React/Vite prototype, not a Laravel application yet.

- Runtime: React 19, Vite 8, TypeScript, Tailwind CSS 4, Express 4, `tsx`.
- Persistence: `data/db.json` loaded and rewritten by `server/db.ts`; there is no MySQL schema, migration, Eloquent model, or transaction boundary.
- Routing: `src/App.tsx` uses a client-side string switch; there are no Laravel web routes or Inertia pages.
- API surface: `server/routes.ts` contains 29 endpoint handlers for auth, summaries, transactions, projects, members, donations, contacts, blood donors, committees, notices, welfare, settings, logs, and reports.
- UI surface: public pages, admin pages, member dashboard, reusable navigation/footer/modals, bilingual helper, and the existing image assets are present.
- Existing seed-like data: 2 users, 5 members, 5 projects, 14 transactions, 9 monthly donation records, 20 contact categories, 14 contacts, 4 blood donors, 5 committee records, 2 notices, 1 welfare request, settings, and 1 audit log.
- Current security gaps: login accepts an email without checking the submitted password; a default super-admin is created client-side; role switching is client-side; API handlers do not authenticate or authorize requests; private member/financial data can be requested directly; uploads and inputs are not validated by Form Requests; financial updates are file writes rather than atomic database operations.
- Current correctness gaps: money uses JavaScript numbers; the member dashboard requests the complete financial summary; the welfare approval flow creates a transaction in a second request; demo/default records are mixed with official-looking figures; public home data is fetched through multiple client effects; browser routing and refresh/deep links are not server routes.
- Current verification baseline: PHP 8.4.15 and Composer 2.9.5 are available; Node 24.13.0 is available; `node_modules`, `composer.json`, `artisan`, and package lock files are absent. `npm` PowerShell execution is blocked by local execution policy, so use `npm.cmd` for Node verification.

## Prioritized implementation plan

### Phase 0 - Preserve and establish the Laravel shell (P0)

1. Preserve the current `src/` UI and image assets as the design reference.
2. Add the Laravel application in this repository with the installed PHP version and a compatible current Laravel release; do not upgrade the existing frontend dependencies blindly.
3. Add Inertia Laravel, Inertia React, Vite integration, authentication scaffolding, MySQL configuration, and a test harness.
4. Create shared layout/page conventions and migrate the existing public shell (`Navbar`, `Footer`, mobile navigation, notifications, language preference, receipt modal) into `resources/js` without changing the visual system.
5. Add route, build, migration, and baseline test checks before feature migration.

### Phase 1 - Identity, roles, settings, and public content (P0)

1. Implement database-backed users with secure password authentication and only `super_admin` and `member` roles.
2. Use Spatie Permission only if compatible with the selected Laravel version; otherwise use policies/enums without introducing a duplicate authorization system.
3. Implement settings, committee/member records, notices, and public pages via Inertia props.
4. Add policies and server-side route authorization; remove client-only role switching/default admin access.
5. Add Bangla default locale, English translations, and bilingual database fields for public content.

### Phase 2 - Projects and media (P0)

1. Implement project/category models, bilingual content, status, dates, budget, gallery/video metadata, and public visibility.
2. Preserve the existing project cards/detail UI and route them through Laravel/Inertia.
3. Seed the three requested activities. Values that cannot be verified from supplied data will be explicitly marked demo data.
4. Add secure image/receipt upload validation. Use Spatie Media Library after dependency/version compatibility is confirmed.

### Phase 3 - Central financial ledger (P0)

1. Replace JSON transaction persistence with decimal MySQL ledger columns, indexed relationships, creator, status, cancellation/correction history, references, attachments, and fund restrictions.
2. Implement one transaction action/service with database transactions, voucher generation, validation, and audit logging.
3. Derive organization and project balances only from valid ledger entries; avoid duplicated monthly donation rows being counted as separate money.
4. Migrate admin ledger, quick entry, monthly donations, receipts, reports, and public transparency to authorized Inertia queries.
5. Restrict member views to the authenticated member's own contribution history and permitted aggregate summaries.

### Phase 4 - Contacts and welfare privacy (P0)

1. Implement configurable contact categories and photo-based contacts with phone/WhatsApp, area, availability, verification, and public visibility.
2. Preserve the existing emergency/contact card design and click-to-call behavior.
3. Never seed invented emergency numbers; retain only administrator-supplied or clearly demo-labelled data.
4. Protect welfare applicants and private contact fields with policies and explicit public visibility rules.

### Phase 5 - Admin/member dashboards and CRUD completion (P1)

1. Create separate `AdminLayout` and `MemberLayout` while preserving the existing app-like cards, mobile navigation, charts/summary visuals, filters, pagination, empty states, and feedback states.
2. Complete CRUD for members, projects, transactions, contacts, notices, settings, welfare review, and media.
3. Add server-side search/filter/date-query validation, pagination, printable receipts, and audit-log views.

### Phase 6 - Quality, security, and release verification (P0)

1. Add feature tests for authentication, role boundaries, member isolation, ledger totals/cancellation, project balances, contact visibility, welfare privacy, uploads, and critical CRUD.
2. Run focused tests, formatting/lint, `composer validate`, `php artisan route:list`, `php artisan migrate:status`, `npm.cmd run lint`, `npm.cmd run build`, and dependency/security checks after each phase.
3. Review migration reversibility and never run destructive migrations or overwrite existing data without explicit approval.
4. Produce deployment documentation, required environment variables, setup/seed commands, queue/storage/cache guidance, and a precise outstanding-issues list.

## Verification boundaries

The existing JSON records are prototype data, not proof of real financial records. They must not be presented as verified funds unless the administrator confirms them. No production-ready claim will be made until the Laravel application boots, migrations run on a configured database, authenticated browser flows work, authorization tests pass, and the production build succeeds.

## Execution status (2026-09-26)

Completed in this pass:

- Laravel 13.33 application shell with Inertia Laravel 3.4, Inertia React 3.6, Vite 8, and the preserved React/Tailwind design assets.
- Database migrations/models for members, projects, contacts/categories, notices, settings, decimal ledger transactions, monthly donations, audit logs, welfare requests, users/roles, and yearly ledger sequences.
- Idempotent prototype-data import. Imported JSON projects, contacts, and financial rows are marked demo; demo money is excluded from public totals and demo contact phone/WhatsApp values are not exposed as public call targets.
- Secure session login for Super Admin and Member, role middleware, server-side member data isolation, ledger policies, transactional ledger actions, yearly vouchers, cancellation history, and audit records.
- Inertia-backed home/projects/project-detail/public content routes, verified-contact boundary, admin dashboard, paginated ledger, project management, and contact management surfaces.
- Public donation confirmations, welfare applications, and blood-donor registrations now use throttled Inertia POST routes with Form Requests; public submissions remain pending/private until administrator review.
- Administrator review surfaces now cover notices, website settings, welfare requests, and donation confirmations. Approved donations and welfare disbursements enter the central ledger through transactional actions exactly once with audit history.
- Member dashboard now receives its profile, organization aggregate, and isolated contribution history from server-side queries; no client-side financial API fetch is used by the canonical route.
- Added a database-backed blood-donor directory with verification/publication gates; imported prototype donors remain demo and are not exposed publicly.
- Feature tests, TypeScript checking, Pint, production build, route listing, and migration-status checks.
- Added stable Spatie Media Library `^11.23` integration with the published `media` migration, secure image/PDF validation, project featured/gallery collections, contact portrait/vehicle collections, transaction receipt collection, legacy path fallbacks, and a feature test covering all three upload paths.
- Added dedicated canonical Admin ProjectManagement and Ledger pages so multipart uploads include payment method, proof files, project images, and galleries without changing the preserved prototype pages.
- Added printable receipt authorization and server-side financial reports/date/type/fund filters; corrected public-layout dashboard navigation and removed canonical AuthContext/API fallback identity behavior.
- Added [`LARAVEL_DEPLOYMENT.md`](LARAVEL_DEPLOYMENT.md) with environment, migration, queue, media-storage, backup, and release verification guidance.
- Verified the complete migration set and selected authentication, ledger, and media tests against a dedicated local MySQL 8.4.7 `ukpjs` database. The MySQL connection now explicitly defaults to InnoDB because the local server defaults to MyISAM and otherwise rejects utf8mb4 unique indexes.
- Replaced the simulated public contact form with a throttled private `contact_messages` workflow, administrator review statuses, audit logging, and a new Contact Messages admin inbox. Removed invented public phone/email/address fallbacks from the canonical contact page.
- Added non-destructive edit/archive controls for members, contacts, and projects; archive actions retain records and write audit logs instead of deleting organizational history.
- Added notice edit/archive management and monthly-donation commitment creation. Commitment rows are deliberately separate from the central ledger and are covered by a no-double-counting feature test.
- Added monthly-donation payment reconciliation: a completed central ledger transaction is linked to the commitment exactly once, and ledger cancellation reopens the commitment without deleting history. Added the linking migration and feature coverage.
- Added validated server-side filtering and query-preserving pagination to project, ledger, contact, member, monthly-donation, notice, contact-message, donation-confirmation, and welfare-review lists, with corresponding admin UI controls and feature coverage.
- Added transactional website-settings updates with administrator audit history and a visible recent-change panel in the settings page.
- Added database-backed password reset links and reset pages using Laravel's password broker, generic email responses to avoid account enumeration, throttling, and feature coverage.
- Removed legacy `/api` fallback effects from the canonical public Inertia pages for projects, project details, committee, emergency contacts, notices, transparency, donation data, blood donors, and welfare submissions. Preserved old prototype pages/components for reference, but they are not used by the canonical Laravel routes.
- Latest verification: 32 feature tests / 354 assertions pass on SQLite; the password-reset tests pass and the earlier full suite passed on the dedicated local MySQL 8.4.7 `ukpjs` database after the monthly-link migration. `vendor\\bin\\pint --test`, `npm.cmd run lint`, `npm.cmd run build`, `composer validate --no-check-publish`, `composer audit`, `php artisan route:list --except-vendor`, `php artisan migrate:status`, and `php artisan optimize:clear` pass. Live HTTP smoke returned 200 for canonical public pages and 302 for protected admin pages without authentication.

Still required before production sign-off:

- Configure the production MySQL credentials and run the release migration/seed procedure against the deployment database; the local dedicated MySQL schema and representative database-backed tests are verified.
- Improve the compact settings history presentation if a richer audit browser is required; the current settings edit/history flow is functional and transactional.
- Remove the unreachable legacy emergency prototype block in the canonical home component after visual regression review; the live homepage already uses only the reusable verified-contact section.
- Configure production media storage (local public disk versus S3), email verification policy, backup/queue/cache configuration, mail delivery, and deployment secrets.
- Add browser-level authenticated verification and visual QA at mobile/desktop breakpoints; current HTTP checks verify Inertia component/data responses, not screenshot-level layout fidelity.
- Browser visual smoke is now confirmed for the public homepage and login page; authenticated admin/member browser flows and multi-breakpoint screenshot QA remain outstanding because no test credentials were entered into the browser session.

## Current repository audit and next phases (2026-09-28)

The earlier prototype audit and completed migration record above are historical. The checked-out project is now a Laravel 13.33 / Inertia React 3.6 application, with the generated React/Express prototype retained alongside it as a visual/data reference. This audit inspected the active routes, middleware, models, ledger actions, requests, public/admin/member controllers, canonical Inertia entry points, migrations, tests, dependency manifests, deployment notes, and source folder inventory. The checkout has no Git metadata at this directory or either checked parent, so Git-based change attribution is unavailable.

### Prioritized remaining implementation plan

1. **P0 - Close verified-data and release gaps.** Keep imported contact and financial records marked demo until an administrator validates them. Remove the unused named-person contact fallbacks from the homepage source after confirming the canonical Inertia page uses only server-provided contacts. Configure production secrets, MySQL, mail delivery, queue/cache workers, media storage, backups, and the organization's verified committee/contact details before release. Complete authenticated admin/member browser QA at mobile and desktop sizes.
2. **P1 - Finish member history and financial usability.** Completed in this pass: member contribution history is now paginated at 20 rows, while aggregate totals and current-month payment status query the full member-scoped verified ledger. Add date/fund filters and receipt links if required by member operations.
3. **P1 - Consolidate the React source tree incrementally.** Keep the canonical Inertia pages under `resources/js/Pages`; map actual imports before moving files, then extract repeated UI to feature components. Retain the original `src/` prototype as a reference until each replacement has visual regression coverage. Avoid bulk moves or deleting the working design reference.
4. **P1 - Complete localization.** Preserve Bangla as the default and keep existing bilingual database fields. Introduce translation dictionaries for repeated navigation, validation feedback, and dashboard/admin labels, then migrate canonical pages in small batches with TypeScript/build checks.
5. **P1 - Confirm public representative presentation.** The canonical homepage has dynamic Chairman, Women Member, and Ward Member cards after its hero, with click-to-call guarded by verified, non-demo status. Confirm its exact visual placement and responsive behavior in a browser session using administrator-approved contact records.
6. **P2 - Final operational sign-off.** Re-run all project checks after each code phase; apply only reviewed additive migrations to a configured target database. Verify backups/restores, HTTPS/session settings, mail, media URLs, and production health checks before release.

### Audit evidence and implementation status

- Framework/dependencies: Laravel `^13.17` (lockfile-resolved 13.33), Inertia Laravel `^3.4`, React 19, Inertia React `^3.6.1`, Vite 8, and Spatie Media Library `^11.23`; versions are constrained by current lockfiles and were not blindly upgraded. Spatie Permission is not installed; current roles use a two-value user role field and server-side middleware/policies.
- Runtime surface: 57 Laravel web routes register. Public pages and submissions, login/password reset, admin modules, member dashboard, and receipt authorization use Laravel routes and Inertia. `server.ts`, `server/`, and `src/` remain legacy reference code and are not canonical request paths.
- Data/security: 15 migrations are applied in the configured local database. Prototype imported ledgers and contacts are flagged demo; public finance excludes demo entries and public call targets require verified non-demo contacts. Financial cancellation retains history. Members cannot reach admin routes and contribution queries are member-scoped.
- Known architectural gap: the React tree contains parallel/legacy page implementations and flat components; the requested feature component namespaces and dedicated auth layout/i18n module are not fully established. Refactor these by imports and verification, never by deleting the source reference wholesale.
- Known user-facing gap: member contribution history previously stopped at 100 rows and derived summary values from those rows. This pass fixes the cap, moves summary calculations to full authorized database aggregates, adds 20-row pagination, and adds regression coverage.
- Verification in this checkout: `php artisan route:list --except-vendor` reports 57 routes; `php artisan migrate:status` reports 15 applied migrations; `php artisan test --compact` passes 33 tests / 374 assertions; `npm.cmd run lint` passes; `npm.cmd run build` succeeds. `vendor\\bin\\pint --test` is running for the final changed PHP files.
- Release boundary: these local checks do not establish live production configuration or authenticated browser/mobile visual QA. Do not present the project as production signed off until those operational and browser checks are completed.
