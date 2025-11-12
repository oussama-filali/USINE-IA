-- Script SQL pour créer la table newsletter dans Supabase

-- 1. Créer la table newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  subscription_source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Créer un index sur l'email pour des recherches rapides
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);

-- 3. Créer un index sur is_subscribed pour filtrer les abonnés actifs
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter(is_subscribed);

-- 4. Activer Row Level Security (RLS)
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- 5. Créer une politique pour permettre les insertions publiques (inscription)
CREATE POLICY "Allow public insert" ON newsletter
  FOR INSERT
  WITH CHECK (true);

-- 6. Créer une politique pour permettre les mises à jour publiques (désinscription)
CREATE POLICY "Allow public update" ON newsletter
  FOR UPDATE
  USING (true);

-- 7. Créer une politique pour permettre les lectures publiques (optionnel - désactiver si privé)
-- CREATE POLICY "Allow public read" ON newsletter
--   FOR SELECT
--   USING (true);

-- 8. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 9. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_newsletter_updated_at
  BEFORE UPDATE ON newsletter
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Table newsletter créée avec succès!';
END $$;
