# NEET MASTER — Production Starter

A production-oriented Next.js + Supabase starter for a NEET test platform.

## What is included
- Premium responsive homepage
- Student login/signup UI
- Dashboard
- Test library
- Result/analytics shell
- Admin control center
- Question review area
- PDF import workflow UI
- Test builder UI
- Supabase/PostgreSQL schema
- RLS starter policies
- Configurable +4/-1/0 scoring fields
- Architecture ready for question-level analytics and achievements

## Important
This is the production STARTER, not a finished hosted service. Authentication, database writes, PDF extraction, admin authorization, payment/subscription (if added), email/OTP and full quiz submission logic must be connected and tested before public launch.

## Run locally
1. Install Node.js LTS.
2. Open this folder in VS Code.
3. In terminal:
   npm install
   npm run dev
4. Open http://localhost:3000

## Supabase
1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Copy `.env.example` to `.env.local`.
4. Add your Supabase project URL and publishable key.
5. Build real Auth flows and secure admin role policies before launch.

## Vercel
Push to GitHub, import the repository into Vercel, add the same environment variables, then deploy.

## Google
After the domain is live:
- add the site to Google Search Console
- publish `sitemap.xml`
- verify indexing
- add useful public pages and metadata
- do not expect instant indexing

## Security checklist
- Never use demo passwords in production.
- Never store passwords in localStorage.
- Never put Supabase service-role keys in client-side code.
- Enforce admin access server-side/RLS.
- Validate PDF MIME type and size.
- Store private PDFs in protected storage.
- Rate-limit auth and quiz endpoints.
- Add backups and monitoring.
