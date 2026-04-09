import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Frontend build (Vite dist)
// In production hosting, the deployment layout can vary. Allow overriding with FRONTEND_DIST_DIR.
const frontendDistDir = process.env.FRONTEND_DIST_DIR
  ? path.resolve(process.env.FRONTEND_DIST_DIR)
  : path.join(__dirname, '../immersive-brain/dist');

const hasFrontendDist = fs.existsSync(frontendDistDir) && fs.existsSync(path.join(frontendDistDir, 'index.html'));

// Servir les fichiers statiques du frontend (si le build est présent)
if (hasFrontendDist) {
  app.use(express.static(frontendDistDir));
}

// Favicon placeholder pour éviter les erreurs 502
app.get('/favicon.ico', (_req, res) => res.status(204).end());

// Route pour servir index.html sur / (si build présent)
app.get('/', (_req, res) => {
  if (!hasFrontendDist) {
    return res.status(200).json({
      status: 'ok',
      message: 'API USINE-IA fonctionne (frontend dist non présent)',
    });
  }
  return res.sendFile(path.join(frontendDistDir, 'index.html'));
});

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
// Backend: prefer service role key to avoid RLS issues on server-side operations.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    '❌ SUPABASE_URL et (SUPABASE_SERVICE_ROLE_KEY ou SUPABASE_ANON_KEY) doivent être définis dans .env'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Optional: Brevo (Sendinblue) Contacts API integration.
// SMTP is only for sending emails; it does NOT add contacts or trigger automation workflows.
const brevoApiKey = process.env.BREVO_API_KEY;
const brevoListIdRaw = process.env.BREVO_LIST_ID;
const brevoListId = brevoListIdRaw ? Number.parseInt(String(brevoListIdRaw), 10) : null;
const brevoEnabled = Boolean(brevoApiKey) && Number.isFinite(brevoListId);

async function brevoUpsertContact(email) {
  if (!brevoEnabled) return;

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': brevoApiKey,
    },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      listIds: [brevoListId],
      attributes: {
        SOURCE: 'website',
      },
    }),
  });

  if (response.ok) return;

  const text = await response.text().catch(() => '');
  throw new Error(`Brevo API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
}

async function brevoRemoveFromList(email) {
  if (!brevoEnabled) return;

  const response = await fetch(`https://api.brevo.com/v3/contacts/lists/${brevoListId}/contacts/remove`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': brevoApiKey,
    },
    body: JSON.stringify({ emails: [email] }),
  });

  if (response.ok) return;
  const text = await response.text().catch(() => '');
  throw new Error(`Brevo API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
}

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

    const normalizedEmail = email.toLowerCase().trim();

    // If Brevo is configured, add/update contact in Brevo first.
    // This is what triggers Brevo automations (welcome workflow).
    if (brevoEnabled) {
      try {
        await brevoUpsertContact(normalizedEmail);
      } catch (e) {
        console.error('Erreur Brevo:', e?.message || e);
        return res.status(502).json({
          error: "Inscription impossible (Brevo)",
          details:
            "La connexion à Brevo a échoué. Vérifiez BREVO_API_KEY, BREVO_LIST_ID et l'automatisme (list trigger).",
        });
      }
    }

    // Insertion dans Supabase (log/backup)
    const { data, error } = await supabase
      .from('newsletter')
      .upsert(
        {
          email: normalizedEmail,
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

    const normalizedEmail = email.toLowerCase().trim();

    const { error } = await supabase
      .from('newsletter')
      .update({
        is_subscribed: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('email', normalizedEmail);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({ 
        error: 'Erreur lors de la désinscription',
        details: error.message 
      });
    }

    if (brevoEnabled) {
      try {
        await brevoRemoveFromList(normalizedEmail);
      } catch (e) {
        console.error('Erreur Brevo (unsubscribe):', e?.message || e);
        // Keep unsubscribe successful for the user; Brevo sync can be retried later.
      }
    }

    res.json({ success: true, message: 'Désinscription réussie' });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// SPA fallback (deep links) — do not intercept API routes.
if (hasFrontendDist) {
  app.get(/^(?!\/api\/).*$/, (_req, res) => {
    res.sendFile(path.join(frontendDistDir, 'index.html'));
  });
}

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 API USINE-IA démarrée sur http://localhost:${PORT}`);
  console.log(`📧 Newsletter endpoint: http://localhost:${PORT}/api/newsletter/subscribe`);
  console.log(`🖼️ Frontend dist: ${hasFrontendDist ? frontendDistDir : '(absent)'} (override with FRONTEND_DIST_DIR)`);
});
