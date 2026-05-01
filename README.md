# Site Car — Plateforme professionnelle de vente de voitures

Monorepo complet avec :

- **Frontend** : Next.js 14 (App Router) + Tailwind CSS + Framer Motion + NextAuth
- **Backend** : Node.js + Express + MongoDB + Mongoose + JWT + Socket.io
- **Images** : Cloudinary (prêt à brancher)
- **Emails** : Nodemailer + templates HTML
- **Temps réel** : vues live / visiteurs sur fiches
- **Admin** : dashboard protégé, gestion voitures, utilisateurs, demandes, rendez-vous, avis, blog
- **SEO** : métadonnées, sitemap, robots, JSON-LD, URLs propres
- **PWA & Analytics** : structure prête

> Cette base est conçue pour être **scalable**, modulaire et prête à être étendue en production.

---

## 1) Arborescence

```bash
site-car/
├─ backend/             # API Express
├─ frontend/            # Frontend Next.js
├─ package.json         # workspaces
└─ README.md
```

---

## 2) Prérequis

- Node.js 20+
- MongoDB local ou Atlas
- npm 10+

---

## 3) Installation

### Installer toutes les dépendances

```bash
npm install
npm run install:all
```

### Configurer les variables d'environnement

Copier les fichiers d'exemple :

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Configurer les valeurs :

- MongoDB URI
- JWT secrets
- Cloudinary
- SMTP
- NextAuth
- API URLs

---

## 4) Démarrage

### Backend

```bash
cd backend
npm run dev
```

API sur : `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

Site sur : `http://localhost:3000`

### Lancer les deux ensemble depuis la racine

```bash
npm run dev
```

---

## 5) Seeder la base

```bash
npm run seed
```

Le seed ajoute :

- 10 voitures fictives
- catégories / marques
- un utilisateur admin
- articles blog
- avis clients

### Compte admin par défaut

- **Email** : `admin@sitecar.com`
- **Mot de passe** : `Admin123!`

> À changer dès le premier déploiement.

---

## 6) Fonctionnalités incluses

### Frontend
- Hero premium avec CTA
- Catalogue avec filtres, recherche, tri, vue grille/liste
- Page détail voiture avec galerie, caractéristiques, financement, similaires
- Favoris
- Comparateur
- Blog
- Contact / FAQ / À propos / Financement
- Dark mode
- Barre WhatsApp flottante
- SEO de base et JSON-LD
- Responsive

### Backend
- Auth JWT + rôles
- CRUD voitures
- CRUD blog
- demandes de contact
- rendez-vous
- avis
- statistiques admin
- upload prêt pour Cloudinary
- sockets pour activité live
- protections Helmet / rate limit / CORS

---

## 7) Déploiement

### Frontend
- **Vercel**
- Définir variables d'environnement de `frontend/.env.example`

### Backend
- **Render / Railway**
- Définir variables d'environnement de `backend/.env.example`

### MongoDB
- MongoDB Atlas recommandé

---

## 8) Notes de production

Pour finaliser en prod :

1. Connecter un vrai provider OAuth Google/Facebook
2. Remplacer l'autocomplete local par Algolia / Elasticsearch
3. Brancher Cloudinary réel
4. Brancher Stripe / PayPal si module de paiement est activé
5. Configurer RGPD + vraie CMP cookies
6. Ajouter tests E2E (Playwright) et API tests (Vitest / Supertest)
7. Configurer GitHub Actions + lint + typecheck + build

---

## 9) Scripts utiles

### API
```bash
cd backend
npm run dev
npm run seed
npm run build
npm start
```

### WEB
```bash
cd frontend
npm run dev
npm run build
npm start
```

---

## 10) Suite logique

Cette version fournit **une base professionnelle très large** avec tous les modules structurés.  
Tu peux ensuite me demander une **Continuation — Module X** pour :

- finaliser OAuth Google/Facebook
- brancher Cloudinary complet drag & drop
- faire un dashboard admin ultra avancé
- ajouter PWA offline + push
- intégrer Stripe / PayPal
- générer les tests
- packager en Docker / CI-CD
