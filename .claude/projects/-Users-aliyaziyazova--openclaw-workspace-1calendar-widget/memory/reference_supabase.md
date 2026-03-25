---
name: Supabase project reference
description: Supabase project details, auth system, database schema, service role key location
type: reference
---

Supabase backend for Peachy Studio.

- **Project ref:** `vyycfwgkawtqkjllvsuc`
- **URL:** `https://vyycfwgkawtqkjllvsuc.supabase.co`
- **Dashboard:** `https://supabase.com/dashboard/project/vyycfwgkawtqkjllvsuc`
- **Keys:** stored in `.env.local` (gitignored). Anon key for client, service_role for admin.
- **Auth:** Email/password working, Google OAuth needs Google Cloud Console setup
- **Guest code:** `PEACHY2026` — client-side only, no DB
- **Table:** `widgets` with RLS (user_id scoped)
- **Full docs:** `docs/SUPABASE.md`
- **CLAUDE.md:** updated with full auth/DB/dashboard architecture