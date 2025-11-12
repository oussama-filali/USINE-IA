-- Script pour supprimer et recréer proprement la table newsletter

-- 1. Supprimer le trigger
DROP TRIGGER IF EXISTS update_newsletter_updated_at ON newsletter;

-- 2. Supprimer les politiques RLS
DROP POLICY IF EXISTS "Allow public insert" ON newsletter;
DROP POLICY IF EXISTS "Allow public update" ON newsletter;
DROP POLICY IF EXISTS "Allow public read" ON newsletter;

-- 3. Supprimer la table
DROP TABLE IF EXISTS newsletter CASCADE;

-- 4. Supprimer la fonction (sera recréée)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Table newsletter supprimée! Vous pouvez maintenant run create-newsletter-table.sql';
END $$;
