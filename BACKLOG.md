# Backlog — M.A Rénov

## Légende statuts

| Statut | Signification |
|--------|--------------|
| ⬜ | A faire |
| 🟡 | Partiel / en cours |
| ✅ | Fait |
| 🚫 | Annulé / reporté |

---

## PHASE 0 — Nettoyage & contenu réel

> Avant toute feature, assainir ce qui existe.

- ✅ Mettre à jour `site.json` avec les vraies infos (nom, ville, zone, tel, email, slogan)
- ✅ Mettre à jour `services.json` avec les vrais services (portails, clôtures, menuiseries alu, travaux divers)
- ✅ Supprimer la section avis clients du code (`testimonials.json` + tout le JSX lié)
- ✅ Supprimer la localisation des cartes réalisations
- ✅ Corriger les métadonnées dans `layout.js`
- ✅ Corriger `lang="en"` → `lang="fr"` dans `layout.js`

---

## PHASE 1 — Fondations techniques

> Stack back-end à mettre en place avant tout développement admin.

### Base de données (Supabase)
- ✅ Créer le projet Supabase
- ✅ Configurer les variables d'environnement (`.env.local`)
- ✅ Définir et créer le schéma de base de données (5 tables + triggers + RLS)
- ✅ Configurer Supabase Storage (bucket `images`, permissions publiques en lecture + écriture authentifiée)
- ✅ Installer et configurer le client Supabase dans Next.js (`@supabase/ssr`)

### Authentification admin
- ✅ Activer Supabase Auth (email + password)
- ✅ Créer le compte admin manuellement dans Supabase
- ✅ Créer la route `/admin` protégée par proxy Next.js 16
- ✅ Page de login `/admin/login`
- ✅ Proxy de protection : redirection si non authentifié
- ✅ Déconnexion automatique après 15 min d'inactivité

---

## PHASE 2 — Espace Admin

> Interface de gestion du contenu pour l'artisan.

### Layout admin
- ✅ Layout admin global avec bouton déconnexion + timer inactivité 15min
- ✅ Dashboard d'accueil avec liens vers chaque section

### Gestion des services
- ✅ Liste des services avec boutons haut/bas (renumérotation complète)
- ✅ Créer un service (titre, sous-titre, image)
- ✅ Modifier un service
- ✅ Supprimer un service
- ✅ Upload image vers Supabase Storage (desktop + mobile)

### Gestion des réalisations (familles)
- ✅ Liste des familles avec boutons haut/bas
- ✅ Créer une famille (titre, sous-titre, image de couverture)
- ✅ Modifier une famille
- ✅ Supprimer une famille (et ses photos en cascade)
- ✅ Dans chaque famille : ajouter / supprimer / ordonner des photos
- ✅ Upload photos vers Supabase Storage (desktop + mobile)

### Bloc "À la une"
- ✅ Formulaire d'édition (titre, texte, image)
- ✅ Toggle visible / masqué
- ✅ Upload image vers Supabase Storage

### Section artisan
- ✅ Formulaire d'édition (photo, titre, texte de bio)
- ✅ Gestion des points forts (ajouter / supprimer / ordonner)
- ✅ Gestion des blocs de confiance (ajouter / supprimer / ordonner)
- ✅ Upload photo artisan vers Supabase Storage

---

## PHASE 3 — Site public (mise à jour)

> Connecter le site aux vraies données Supabase.

- ✅ Section Services : lire depuis Supabase au lieu du JSON
- ✅ Section Réalisations : lire depuis Supabase, supprimer la localisation des cartes
- ✅ Page galerie `/realisations/[id]` : afficher les photos d'une famille (galerie masonry)
- ✅ Bloc "À la une" : créer la section sur le site, affichage conditionnel selon `visible`
- ✅ Section Artisan : lire depuis Supabase
- ✅ Remplacer les `<img>` natifs par le composant `<Image>` de Next.js
- ✅ Page galerie `/realisations/[id]` : lightbox desktop avec navigation ← →
- ✅ Bloc "À la une" : label du badge éditable en admin, image supprimable
- ✅ Admin artisan : édition inline des points forts et blocs de confiance
- ✅ Header partagé (2 niveaux desktop + hamburger mobile) dans composant `Header.js`
- ✅ Logo cliquable → `/`
- ✅ Nav liens en `/#services` et `/#realisations` (fonctionnels depuis toutes les pages)
- ✅ Dropdown mobile fond `bg-blue-100`
- ✅ Page galerie famille : overlay loader (disparaît quand toutes les images sont chargées)
- ✅ Bullets section artisan : petits carrés blancs
- ✅ Bloc "À la une" : fond `bg-blue-100/40`
- ✅ Compression images à l'upload : Canvas API → WebP, max 1920px, qualité 82%
- ⬜ Suppression admin : supprimer le fichier Supabase Storage en même temps que l'entrée BDD

---

## PHASE 4 — SEO & performance

- ✅ Métadonnées dynamiques par page (title, description)
- ✅ `og:image` pour le partage réseaux sociaux
- ✅ `sitemap.xml` généré automatiquement (inclut les pages réalisations avec slugs)
- ✅ `robots.txt` (bloque /admin, référence sitemap)
- ✅ Balises Schema.org `LocalBusiness`
- ✅ URLs slugs pour les réalisations (`/realisations/clotures` au lieu de l'UUID)
- ✅ Pages publiques en `force-dynamic` (modifications admin visibles sans redéploiement)
- ✅ Email artisan dans le footer
- ✅ Lighthouse score : 98 Performance / 96 Accessibilité / 100 Bonnes pratiques / 100 SEO
- ✅ Google Search Console : propriété vérifiée + sitemap soumis
- ✅ Fix `metadataBase` dans `layout.js` : pointe encore sur `marenov34.vercel.app` → corriger vers `marenov34.fr`
- ✅ Fix URL sitemap dans `robots.js` : pointe encore sur `marenov34.vercel.app` → corriger vers `marenov34.fr`
- ✅ Fix Schema.org `url` dans `layout.js` : même problème
- ⬜ Google Business Profile : vérifier publication fiche M.A Rénov + ajouter URL site

---

## PHASE 5 — Identité visuelle

> À appliquer en dernière passe sur l'ensemble du site.

- ✅ Remplacer la couleur principale `slate-900` par le bleu marine de la marque (~`#2C3A47`)
- ✅ Intégrer la police Google Fonts (Josefin Sans)
- ✅ Intégrer le logo dans le header (composant Logo.js)
- ✅ Favicon aux couleurs de la marque
- ✅ Animations hover sur les boutons (header + hero)
- ✅ Logo "Fabriqué en France" dans la section artisan
- ✅ Formulaire de contact avec validation côté client et serveur
- ✅ Lisibilité inputs admin (correction héritage couleur body)
- ✅ Cohérence globale header / footer / sections

---

## PHASE 6 — Déploiement

- ✅ Déployer sur Vercel (auto-deploy sur push main)
- ✅ Connecter les variables d'environnement Supabase sur Vercel
- ✅ Connecter le nom de domaine marenov34.fr (DNS OVH → Vercel)
- ⬜ Créer email pro contact@marenov34.fr dans OVH
- ✅ Formulaire de contact : route API `/api/contact` avec Resend + validation serveur
- ✅ Formulaire de contact : ajouter `RESEND_API_KEY` dans `.env.local` et Vercel env vars
- ✅ Formulaire de contact : changer `to` → `ste.marenov@gmail.com`
- ✅ Formulaire de contact : changer `from` → `contact@marenov34.fr` (domaine vérifié sur Resend)
- ✅ Vérifier le formulaire de contact en production (envoi email réel)
e - ⬜ Re-uploader les photos existantes (compression WebP) + nettoyer Supabase Storage

---

## PHASE 7 — Optimisations post-audit

### Sécurité
- ⬜ API contact : rate limiting (protection spam/DoS)
- ⬜ API contact : limite de longueur sur les champs (max 5000 chars pour message)
- ⬜ API contact : ne pas retourner l'erreur Resend brute au navigateur
- ⬜ Suppression admin : supprimer fichier Supabase Storage en même temps que l'entrée BDD

### Performance & images
- ⬜ `PhotoGallery.js` : remplacer `<img>` natifs par `next/image`
- ⬜ `Logo.js` : supprimer `unoptimized={true}`
- ⬜ `layout.js` : supprimer import `Geist_Mono` inutilisé
- ⬜ Re-uploader les photos existantes (compression WebP) + nettoyer Supabase Storage

### Maintenabilité
- ⬜ Extraire le footer en composant réutilisable `<Footer />`
- ⬜ Extraire la barre d'action mobile en composant `<MobileActionBar />`

### Accessibilité
- ⬜ Image héros : ajouter `alt` descriptif
- ⬜ `PhotoGallery.js` : rendre la lightbox accessible sur mobile (tactile)

---

## Backlog technique transverse

- ⬜ Prettier configuré
- ⬜ Variables d'environnement dans `.env.local` (jamais committé)
- ⬜ Validation des inputs côté serveur sur toutes les routes API
- ⬜ Rate limiting sur les routes sensibles (contact, login)
- ⬜ Soft deletes (`deleted_at`) sur les entités admin
- 🚫 TypeScript — rester en JS pour l'instant
- 🚫 Avis clients — abandonné
