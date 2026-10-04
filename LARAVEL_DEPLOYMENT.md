# Umarkhali Kistupur Probashi Jubo Songho

## Local installation

1. Copy `.env.example` to `.env`, set `APP_KEY` with `php artisan key:generate`, and choose SQLite or MySQL values.
2. Set `UKPJS_SEED_ADMIN_PASSWORD` and `UKPJS_SEED_MEMBER_PASSWORD` before importing prototype records. Do not use the local fallback passwords in production.
3. Run `composer install`, `php artisan migrate --seed`, `php artisan storage:link`, and `npm.cmd install`.
4. Build with `npm.cmd run build`; serve with `php artisan serve` or the project process manager.

## Production checklist

- Use MySQL with a least-privilege application user, `APP_DEBUG=false`, HTTPS `APP_URL`, secure session/cookie settings, and environment-managed secrets.
- Run `php artisan migrate --force`, `php artisan storage:link`, `php artisan optimize`, and `php artisan queue:work --tries=3` under a supervisor. Media conversions use the configured queue.
- Keep `MEDIA_DISK=public` only for a single-server deployment. For multiple servers, configure an S3-compatible disk and set `MEDIA_DISK=s3` with the AWS variables.
- Schedule backups for the database and media disk. Monitor failed jobs and audit logs; financial corrections are retained rather than deleted.
- Verify the live MySQL schema, seed only administrator-approved records, and perform authenticated desktop/mobile browser QA before release.

## Verification commands

```text
composer validate --no-check-publish
composer audit
vendor\bin\pint --test
php artisan test
php artisan route:list --except-vendor
php artisan migrate:status
npm.cmd run lint
npm.cmd run build
```

The preserved `src/`, `server/`, and `data/db.json` prototype files remain in the repository as the design/data reference. The production request path is Laravel web routes plus Inertia pages under `resources/js/Pages`.
