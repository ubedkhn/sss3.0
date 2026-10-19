-- One-time import of original Floot content into the new Supabase schema.
-- Source: Floot project database. Idempotent by slug; does not overwrite unrelated rows.
BEGIN;
COMMIT;

-- Verify after running: SELECT count(*) FROM public.projects; SELECT count(*) FROM public.journal_posts;