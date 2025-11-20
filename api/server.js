import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './api/.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static('../immersive-brain/dist'));

// Route pour servir index.html sur /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../immersive-brain/dist/index.html'));
});

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_ANON_KEY doivent être définis dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API USINE-IA fonctionne' });
});

// Route d'inscription à la newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation de l'email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format d'email invalide" });
    }

    // Insertion dans Supabase
    const { data, error } = await supabase
      .from('newsletter')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          is_subscribed: true,
          subscribed_at: new Date().toISOString(),
          subscription_source: 'website',
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        error: "Erreur lors de l'inscription à la newsletter",
        details: error.message 
      });
    }

    res.json({
      success: true,
      message: 'Inscription réussie à la newsletter !',
      data: {
        email: data.email,
        subscribed_at: data.subscribed_at,
      },
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route de désinscription
app.post('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email requis' });
    }

    const { error } = await supabase
      .from('newsletter')
      .update({
        is_subscribed: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', email.toLowerCase().trim());

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        error: 'Erreur lors de la désinscription',
        details: error.message 
      });
    }

    res.json({
      success: true,
      message: 'Désinscription réussie',
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API USINE-IA démarrée sur http://localhost:${PORT}`);
  console.log(`📧 Newsletter endpoint: http://localhost:${PORT}/api/newsletter/subscribe`);
});
