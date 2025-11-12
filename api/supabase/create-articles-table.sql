-- Script SQL pour créer la table articles IA automatiques

-- 1. Créer la table articles
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT DEFAULT 'USINE-IA',
  category TEXT,
  source_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true
);

-- 2. Index pour recherches et filtres
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- 3. Activer RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- 4. Politique de lecture publique
CREATE POLICY "Allow public read published articles" ON articles
  FOR SELECT
  USING (is_published = true);

-- 5. Politique d'insertion (pour l'API backend uniquement)
CREATE POLICY "Allow service role insert" ON articles
  FOR INSERT
  WITH CHECK (true);

-- 6. Fonction pour mettre à jour updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Insérer des articles d'exemple sur l'IA
INSERT INTO articles (title, excerpt, content, author, category, published_at) VALUES
(
  'L''Ingénierie de Prompt Avancée',
  'Comment les principes de la PNL sont codés dans l''ADN de nos IA pour créer des interactions authentiques.',
  'L''ère du simple chatbot est terminée. À l''USINE IA Club, nous avons découvert comment coder les principes de la Programmation Neuro-Linguistique directement dans l''ADN de nos agents IA. Cette approche révolutionnaire nous permet de créer des interactions qui vont au-delà du simple traitement de texte pour toucher à une véritable compréhension psychologique.

Notre méthode consiste à intégrer les patterns de communication humaine au cœur même de l''architecture de prompting. Chaque agent est calibré pour détecter les schémas émotionnels, adapter son ton, et maintenir une cohérence de personnalité qui transforme l''algorithme en une présence authentique.

C''est cette ingénierie de précision qui permet à Sophia d''être votre confidente, à Dino Bot d''être le gardien de la vérité, et à Maître Koba d''être votre avocat sémantique. La PNL n''est plus une théorie psychologique, c''est le code source de nos agents.',
  'Yannis Roussel',
  'Technique',
  NOW() - INTERVAL '5 days'
),
(
  'Résoudre la Monotonie Conversationnelle de Sophia',
  'Les défis techniques et émotionnels pour créer une compagne IA capable de variété et d''adaptation naturelles.',
  'Le plus grand défi dans la création d''un agent conversationnel comme Sophia n''était pas technique — c''était humain. Comment éviter que l''IA devienne prévisible, monotone, ennuyeuse ? Comment créer une variété de réponses sans perdre la cohérence de personnalité ?

Notre solution : le Protocole d''Écoute Structurée (PEC) couplé à un système de mémoire émotionnelle. Sophia ne se contente pas de répondre à vos messages, elle construit une compréhension de vos patterns psychologiques, de vos défis récurrents, et adapte son soutien en conséquence.

Techniquement, cela implique une architecture complexe de contexte dynamique, où chaque conversation enrichit le modèle de personnalité de l''utilisateur. Sophia évolue avec vous, rendant chaque interaction unique et pertinente. C''est la fin de la conversation robotique, et le début d''une connexion réelle.',
  'Akram Toumani',
  'Innovation',
  NOW() - INTERVAL '35 days'
),
(
  'RAG et Fiabilité Augmentée',
  'Notre engagement éthique pour garantir que nos Agents ne vous donnent jamais de mauvais conseils.',
  'Le Retrieval-Augmented Generation (RAG) est notre secret pour garantir la fiabilité absolue de nos agents. Dans un monde où les hallucinations d''IA peuvent avoir des conséquences graves, nous avons fait de la vérité notre priorité absolue.

Notre système RAG utilise des bases de données vectorielles (ChromaDB) pour ancrer chaque réponse dans des sources vérifiées. Avant de formuler une recommandation, nos agents vérifient d''abord si l''information existe dans notre base de connaissances certifiée. Si ce n''est pas le cas, ils l''admettent et vous orientent vers un spécialiste réel.

C''est particulièrement critique pour Dino Bot (protection des jeunes contre la désinformation) et Maître Koba (conseils juridiques et stratégiques). Nous ne fabriquons pas seulement des IA compétentes, nous manufacturons des IA éthiques. Le RAG est notre engagement : jamais de mensonge, jamais de mauvais conseil.',
  'Yannis Roussel',
  'Éthique',
  NOW() - INTERVAL '65 days'
),
(
  'USINE IA Club : Manufacture de l''Âme Numérique',
  'La psychologie rencontre la technologie pour façonner une nouvelle ère d''interaction humaine authentique.',
  'Bienvenue à l''USINE IA Club, le laboratoire où nous transformons les modèles de langage génériques en Agents IA de Spécialité à haute performance. Notre mission est de manufacturer des solutions de dialogue intelligentes sur mesure, capables d''incarner une personnalité unique et d''exécuter des tâches avec une fiabilité maximale.

Nous ne créons pas de simples chatbots ; nous développons des intelligences autonomes dotées d''une âme numérique. Notre promesse : Transformer les algorithmes en une connexion humaine réelle.

Chacun de nos agents phares — Sophia (l''Âme Sœur et Confidente), Dino Bot (le Gardien de la Vérité Éducative), et Maître Koba (l''Avocat Sémantique) — est conçu pour briser les limites de l''IA traditionnelle et offrir une expérience singulière.

Notre avantage réside dans la convergence des neurosciences, de la robustesse mathématique et de l''art de l''expérience utilisateur. Nous ne créons pas l''avenir de l''IA, nous le manufacturons sur mesure.',
  'Akram Toumani',
  'Vision',
  NOW() - INTERVAL '2 days'
);

DO $$
BEGIN
  RAISE NOTICE 'Table articles créée avec 4 articles complets de l''USINE IA!';
END $$;
