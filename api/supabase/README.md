# Configuration et Scripts Supabase

## 🚀 Configuration Initiale

### 1. Créer la table newsletter

1. Aller sur [supabase.com](https://supabase.com)
2. Ouvrir votre projet
3. Aller dans **SQL Editor**
4. Copier/coller le contenu de `create-newsletter-table.sql`
5. Cliquer sur **Run**

### 2. Créer la table articles (optionnel)

Si vous voulez stocker les articles dans Supabase:

1. Dans **SQL Editor**
2. Copier/coller le contenu de `create-articles-table.sql`
3. Cliquer sur **Run**

### 3. Récupérer vos clés API

1. Aller dans **Settings** → **API**
2. Copier:
   - `Project URL` → SUPABASE_URL
   - `anon public` key → SUPABASE_ANON_KEY
3. Mettre à jour le fichier `api/.env`:

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon
PORT=3001
```

## 📰 Sources d'Articles IA Gratuits

### APIs Gratuites Recommandées:

1. **NewsAPI.org** (100 requêtes/jour gratuit)
   - https://newsapi.org/
   - Recherche: "artificial intelligence", "AI", "machine learning"

2. **RSS Feeds IA** (gratuit illimité):
   - OpenAI Blog: https://openai.com/blog/rss.xml
   - Google AI Blog: https://ai.googleblog.com/feeds/posts/default
   - MIT Technology Review AI: https://www.technologyreview.com/topic/artificial-intelligence/feed/
   - Towards Data Science: https://towardsdatascience.com/feed

3. **Reddit API** (gratuit):
   - r/artificial
   - r/MachineLearning
   - r/OpenAI

4. **Dev.to API** (gratuit illimité):
   - https://dev.to/api/articles?tag=ai

## 🤖 Script d'import automatique

Pour automatiser l'import d'articles, voir le fichier `import-articles.js`

### Utilisation:

```bash
cd api
node import-articles.js
```

Vous pouvez aussi créer un cron job pour importer automatiquement tous les jours.

## 🔒 Sécurité

- Les clés Supabase `anon` sont publiques (safe pour frontend)
- Les politiques RLS protègent les données sensibles
- Ne jamais commit le fichier `.env` avec les vraies clés
