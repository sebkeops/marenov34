-- ============================================================
-- Schéma Supabase — M.A Rénov
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- ─── Services ────────────────────────────────────────────────
CREATE TABLE services (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  subtitle    text NOT NULL DEFAULT '',
  image_url   text NOT NULL DEFAULT '',
  "order"     integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Familles de réalisations ─────────────────────────────────
CREATE TABLE families (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  subtitle        text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  "order"         integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ─── Photos d'une famille ─────────────────────────────────────
CREATE TABLE family_photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  "order"     integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Bloc "À la une" ─────────────────────────────────────────
CREATE TABLE spotlight (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL DEFAULT '',
  text        text NOT NULL DEFAULT '',
  image_url   text NOT NULL DEFAULT '',
  visible     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Insérer une seule ligne (singleton)
INSERT INTO spotlight (title, text, image_url, visible)
VALUES ('', '', '', false);

-- ─── Section artisan ─────────────────────────────────────────
CREATE TABLE artisan (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url   text NOT NULL DEFAULT '',
  title       text NOT NULL DEFAULT '',
  bio         text NOT NULL DEFAULT '',
  bullets     jsonb NOT NULL DEFAULT '[]',
  trust_items jsonb NOT NULL DEFAULT '[]',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Insérer une seule ligne (singleton) avec les données initiales
INSERT INTO artisan (title, bio, bullets, trust_items)
VALUES (
  'Artisan menuisier à Restinclières',
  'Menuisier aluminium / PVC, je propose mes services pour tous vos travaux, en neuf comme en rénovation. Plus de 20 ans d''expérience et de savoir-faire.',
  '["Menuisier aluminium / PVC, en neuf comme en rénovation", "Plus de 20 ans d''expérience et de savoir-faire", "Indépendant depuis mars 2014", "Projets et conseils personnalisés"]',
  '["Devis gratuit", "Conseils personnalisés", "Réactivité", "Respect des délais", "Travail sérieux et soigné"]'
);

-- ─── Mise à jour automatique de updated_at ───────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER spotlight_updated_at
  BEFORE UPDATE ON spotlight
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER artisan_updated_at
  BEFORE UPDATE ON artisan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Index ───────────────────────────────────────────────────
CREATE INDEX idx_services_order ON services("order");
CREATE INDEX idx_families_order ON families("order");
CREATE INDEX idx_family_photos_family_id ON family_photos(family_id);
CREATE INDEX idx_family_photos_order ON family_photos("order");

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE spotlight ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan ENABLE ROW LEVEL SECURITY;

-- Lecture publique (site visible par tous)
CREATE POLICY "public read services"       ON services       FOR SELECT USING (true);
CREATE POLICY "public read families"       ON families       FOR SELECT USING (true);
CREATE POLICY "public read family_photos"  ON family_photos  FOR SELECT USING (true);
CREATE POLICY "public read spotlight"      ON spotlight      FOR SELECT USING (true);
CREATE POLICY "public read artisan"        ON artisan        FOR SELECT USING (true);

-- Écriture réservée aux utilisateurs authentifiés (admin)
CREATE POLICY "auth write services"       ON services       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth write families"       ON families       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth write family_photos"  ON family_photos  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth write spotlight"      ON spotlight      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth write artisan"        ON artisan        FOR ALL USING (auth.role() = 'authenticated');
