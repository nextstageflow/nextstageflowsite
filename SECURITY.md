# Security Notes

This project is a static frontend that sends contact messages through EmailJS. Because of that:

- There is no SQL layer in this repository, so SQL injection is not a direct risk here.
- Real protection against brute-force, bot abuse, and infrastructure attacks must also be configured at the hosting, CDN, and backend/provider layers.

## Protections implemented in this repo

- Content Security Policy and browser hardening metadata in `index.html`
- Input sanitization and length limits in the contact form
- Honeypot field to catch simple bots
- Client-side cooldown after successful submissions
- reCAPTCHA in the contact modal
- `rel="noreferrer"` on external links opened in a new tab

## Required hosting/provider protections

- Enable HTTPS only
- Configure rate limiting at CDN/WAF or reverse proxy level
- Restrict allowed origins/domains in EmailJS to the production domain
- Monitor submission spikes and provider logs
- Keep dependencies updated
- Configure security headers on the host when supported:
  - `Content-Security-Policy`
  - `Referrer-Policy`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`
  - `Strict-Transport-Security`

## If you add a backend later

- Use parameterized queries only, never string-built SQL
- Validate and sanitize input server-side, not just in the browser
- Verify reCAPTCHA on the server with the secret key
- Add per-IP and per-route rate limiting
- Add request logging and alerting
- Store secrets only in server environment variables
