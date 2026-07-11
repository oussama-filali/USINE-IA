<p align="center">
  <img src="immersive-brain/public/images/logo-usine-ia.png" alt="USINE-IA" width="220" />
</p>

# 🏭 USINE-IA

**🌐 En ligne : [usineiaclub.store](http://usineiaclub.store)**

Collectif marseillais (2024) autour de l'**Intelligence Artificielle Émotionnelle** — Akram, Oussama & Yannis. Ce dépôt contient notre vitrine : une **expérience web immersive 3D** qui présente le collectif et ses agents IA (Sophia, [Dino Bot](https://github.com/oussama-filali/dino-bot)…), adossée à une API de contenu et de newsletter.

## 🗂️ Structure du dépôt

| Dossier | Rôle | Stack |
|---|---|---|
| [`immersive-brain/`](immersive-brain/) | Front immersif 3D (SPA) | React 18 · TypeScript · Vite · Three.js via React Three Fiber & Drei · Tailwind CSS |
| [`api/`](api/) | API newsletter & articles | Node.js · Express · Supabase · Nodemailer (SMTP) · Brevo |
| [`docs/`](docs/) | Docs de conception | Design 3D, stratégie UX de chargement, changelog |

## ✨ Le front immersif ([`immersive-brain/`](immersive-brain/README.md))

- **Station spatiale 3D** (modèle GLB) en rotation continue : éclairage HDR, environment mapping, brouillard atmosphérique.
- **Navigation narrative au scroll** (desktop & mobile, swipe tactile) entre les sections : Hero, From Marseille, Équipe, Mission, Agents, Valeurs, Articles & Newsletter.
- **UX de chargement pensée mobile-first** — afficher du 3D immédiatement, précharger le lourd après le premier rendu, éviter le « 100 % bloqué ». La démarche complète est documentée dans [`docs/UX-LOADING-MOBILE.md`](docs/UX-LOADING-MOBILE.md).
- **Direction artistique** : noir profond, accents cyan/purple, glassmorphism, typographie espacée — détaillée dans [`docs/FRONTEND-DESIGN-README.md`](docs/FRONTEND-DESIGN-README.md).

```bash
cd immersive-brain
npm install
npm run dev   # http://localhost:5173
```

## 🗄️ L'API & la base de données ([`api/`](api/README.md))

Express + Supabase (PostgreSQL), avec une conception BDD assumée :

- Tables `articles` et `newsletter` définies en SQL versionné ([`api/supabase/`](api/supabase/)) : index ciblés, **Row Level Security** activée, politique de lecture publique restreinte aux articles publiés.
- `POST /api/newsletter/subscribe` / `unsubscribe` — inscription synchronisée Supabase + liste de contacts **Brevo** (déclenchement des automatismes d'accueil).
- **Digest d'articles par email** ([`api/newsletter-digest.js`](api/newsletter-digest.js)) via SMTP, alimenté par [`api/import-articles.js`](api/import-articles.js).
- En production, l'API sert aussi le build du front (SPA fallback).

```bash
cd api
npm install
cp .env.example .env   # clés Supabase, SMTP, Brevo
npm start              # http://localhost:3001
```

## 👥 L'équipe

| | |
|---|---|
| **Akram** | Co-fondateur |
| **Oussama Halima-Filali** | Co-fondateur — [github.com/oussama-filali](https://github.com/oussama-filali) |
| **Yannis** | Co-fondateur |

---

*From Marseille, with φ.* 🌊
