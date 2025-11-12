// Script pour importer automatiquement des articles IA gratuits
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour récupérer des articles depuis Dev.to API (gratuit)
async function fetchDevToArticles() {
  try {
    const response = await fetch('https://dev.to/api/articles?tag=ai&per_page=10');
    const articles = await response.json();
    
    return articles.map(article => ({
      title: article.title,
      excerpt: article.description || article.title,
      content: article.body_markdown || article.description,
      author: article.user.name,
      category: 'IA',
      source_url: article.url,
      published_at: article.published_at
    }));
  } catch (error) {
    console.error('Erreur Dev.to:', error);
    return [];
  }
}

// Fonction pour récupérer des articles depuis un RSS feed
async function fetchRSSFeed(feedUrl) {
  try {
    // Note: Nécessite un parser RSS (installer: npm install rss-parser)
    // const Parser = require('rss-parser');
    // const parser = new Parser();
    // const feed = await parser.parseURL(feedUrl);
    
    // Pour simplifier, retourner un tableau vide
    // Vous pouvez implémenter avec rss-parser si besoin
    console.log('RSS parsing non implémenté dans cet exemple');
    return [];
  } catch (error) {
    console.error('Erreur RSS:', error);
    return [];
  }
}

// Fonction principale d'import
async function importArticles() {
  console.log('🚀 Import d\'articles IA en cours...');
  
  // 1. Récupérer les articles Dev.to
  const devToArticles = await fetchDevToArticles();
  console.log(`📰 ${devToArticles.length} articles trouvés sur Dev.to`);
  
  // 2. Insérer dans Supabase (éviter les doublons)
  let imported = 0;
  for (const article of devToArticles) {
    try {
      // Vérifier si l'article existe déjà
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('source_url', article.source_url)
        .single();
      
      if (!existing) {
        const { error } = await supabase
          .from('articles')
          .insert(article);
        
        if (!error) {
          imported++;
        } else {
          console.error('Erreur insertion:', error);
        }
      }
    } catch (error) {
      // Article existe déjà ou autre erreur, continuer
      continue;
    }
  }
  
  console.log(`✅ ${imported} nouveaux articles importés!`);
  console.log(`📊 Total articles dans la base:`, await countArticles());
}

// Compter les articles
async function countArticles() {
  const { count } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });
  return count;
}

// Lancer l'import
importArticles().catch(console.error);

// Export pour utilisation comme module
export { importArticles, fetchDevToArticles };
