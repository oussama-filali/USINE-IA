-- Fix RLS pour permettre les inscriptions newsletter

-- 1. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow public insert" ON newsletter;
DROP POLICY IF EXISTS "Allow public update" ON newsletter;
DROP POLICY IF EXISTS "Enable insert for all users" ON newsletter;
DROP POLICY IF EXISTS "Enable update for all users" ON newsletter;

-- 2. DÉSACTIVER RLS complètement pour la table newsletter
ALTER TABLE newsletter DISABLE ROW LEVEL SECURITY;

-- 3. Message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'RLS désactivé! Newsletter publiquement accessible.';
END $$;
