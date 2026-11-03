-- LaporWarga - Supabase/PostgreSQL Schema
-- Run in Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL DEFAULT 'user'
                CHECK (role IN ('user','admin','field')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL,
  category       TEXT NOT NULL
                 CHECK (category IN (
                   'road_damage','garbage','flooding','lighting','drainage','environment','other'
                 )),
  urgency        TEXT NOT NULL DEFAULT 'medium'
                 CHECK (urgency IN ('low','medium','high')),
  image_url      TEXT,
  latitude       double precision NOT NULL,
  longitude      double precision NOT NULL,
  address_note   TEXT,
  is_anonymous   BOOLEAN NOT NULL DEFAULT false,
  status         TEXT NOT NULL DEFAULT 'submitted'
                 CHECK (status IN (
                   'submitted','verification','in_progress','resolved','rejected'
                 )),
  rejection_reason TEXT,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- Simple index for location queries (works without PostGIS)
CREATE INDEX IF NOT EXISTS idx_reports_latlon ON public.reports
  (latitude, longitude);

-- Assignments table (admin -> field officer)
CREATE TABLE IF NOT EXISTS public.assignments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id             uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  field_officer_id      uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_by_admin_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notes                 TEXT,
  completion_image_url  TEXT,
  completion_notes      TEXT,
  assigned_at           timestamptz NOT NULL DEFAULT now(),
  completed_at          timestamptz,
  UNIQUE (report_id, field_officer_id)
);

-- RLS policies (drop old first)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper: role lookup without RLS recursion
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM public.users WHERE id = auth.uid() $$;

DROP POLICY IF EXISTS "users_select_own" ON public.users;
CREATE POLICY "users_select_own"
  ON public.users FOR SELECT
  USING (auth.uid() = id OR public.user_role() = 'admin');

-- Admin mengelola role & menghapus user dari panel
DROP POLICY IF EXISTS "users_update_admin" ON public.users;
CREATE POLICY "users_update_admin"
  ON public.users FOR UPDATE
  USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "users_delete_admin" ON public.users;
CREATE POLICY "users_delete_admin"
  ON public.users FOR DELETE
  USING (public.user_role() = 'admin');

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reports_insert_public" ON public.reports;
CREATE POLICY "reports_insert_public"
  ON public.reports FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "reports_select_public" ON public.reports;
CREATE POLICY "reports_select_public"
  ON public.reports FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "reports_update_admin" ON public.reports;
CREATE POLICY "reports_update_admin"
  ON public.reports FOR UPDATE
  USING (public.user_role() IN ('admin','field'));

DROP POLICY IF EXISTS "reports_delete_admin" ON public.reports;
CREATE POLICY "reports_delete_admin"
  ON public.reports FOR DELETE
  USING (public.user_role() = 'admin');

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "assignments_insert_admin" ON public.assignments;
CREATE POLICY "assignments_insert_admin"
  ON public.assignments FOR INSERT
  WITH CHECK (public.user_role() = 'admin');

DROP POLICY IF EXISTS "assignments_update_field" ON public.assignments;
CREATE POLICY "assignments_update_field"
  ON public.assignments FOR UPDATE
  USING (field_officer_id = auth.uid());

DROP POLICY IF EXISTS "assignments_select_related" ON public.assignments;
CREATE POLICY "assignments_select_related"
  ON public.assignments FOR SELECT
  USING (
    field_officer_id = auth.uid()
    OR public.user_role() IN ('admin','field')
  );

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reports_updated_at ON public.reports;
CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Supabase Auth trigger: auto-create users profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for report photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "report_images_read_public" ON storage.objects;
CREATE POLICY "report_images_read_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'report-images');

DROP POLICY IF EXISTS "report_images_insert_authenticated" ON storage.objects;
CREATE POLICY "report_images_insert_authenticated"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'report-images' AND auth.uid() IS NOT NULL);