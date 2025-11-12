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
