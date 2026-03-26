# API Backend USINE-IA

Backend Node.js + Express pour gérer la newsletter avec Supabase.

## Installation

```bash
cd api
npm install
```

## Configuration

1. Copier `.env.example` vers `.env`:
```bash
cp .env.example .env
```

2. Remplir vos clés Supabase dans `.env`:
```
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon
PORT=3001
```

### Envoi d'emails (Digest)

Pour envoyer automatiquement un digest d'articles par email, l'API utilise :
- une clé Supabase **service role** (backend only) pour lire la liste des abonnés
- un compte SMTP (Brevo/Mailjet/SendGrid, etc.)

Ajouter dans `api/.env` (voir `api/.env.example`) :

```env
SUPABASE_SERVICE_ROLE_KEY=...

SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...

MAIL_FROM_EMAIL=no-reply@votre-domaine.com
MAIL_FROM_NAME=USINE-IA
```

Commandes :

```bash
# Envoi test (1 destinataire)
npm run send:digest -- --test you@example.com

# Envoi réel à tous les abonnés (pensez à DRY_RUN=false)
npm run send:digest
```

⚠️ Par défaut `DRY_RUN=true` dans `.env.example` (aucun email n'est envoyé).

## Lancement

```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3001`

## Endpoints

- `GET /api/health` - Test de santé de l'API
- `POST /api/newsletter/subscribe` - Inscription newsletter
- `POST /api/newsletter/unsubscribe` - Désinscription

## Structure Supabase

Table `newsletter`:
```sql
CREATE TABLE newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  is_subscribed BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  subscription_source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
