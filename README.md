# Thysmots

Jeu de lettres (style Motus/Wordle) construit avec Next.js et une organisation Clean Architecture.

## Sommaire
- Aperçu de l’architecture
- Installation et lancement
- Scripts NPM
- Tests (Jest + RTL)
- Détails par couche
- Points d’extension

---

## Aperçu de l’architecture

Le code applicatif réside sous `src/`. Le dossier Next.js `app/` ne contient que des stubs qui réexportent la logique de `src/`.

```
src/
├─ domain/                         # Noyau métier (pur, sans dépendances externes)
│  ├─ entities/                    # Modèles (ex: Word)
│  ├─ services/                    # Services métier purs (ex: evaluate)
│  ├─ valueObjects/                # Value Objects
│  └─ ports/                       # Interfaces (contrats) coté domaine
│
├─ app/
│  └─ use_cases/                   # Cas d’usage (orchestration du domaine)
│     ├─ GetDailyWordUseCase.ts
│     ├─ GetRandomWordUseCase.ts
│     ├─ ValidateWordUseCase.ts
│     ├─ SubmitScoreUseCase.ts
│     ├─ ListLeaderboardUseCase.ts
│     └─ index.ts
│
└─ frameworks/
   └─ drivers/
      ├─ http/                     # Handlers utilisés par app/api/*
      │  ├─ randomWord.ts
      │  ├─ validateWord.ts
      │  └─ leaderboard.ts
      ├─ pages/                    # Composants de pages Next.js (réexportés par app/*)
      │  ├─ HomePage.tsx
      │  ├─ DailyPage.tsx
      │  ├─ EndlessGame.tsx
      │  └─ Leaderboard.tsx
      ├─ ui/                       # Composants UI (WordGame, Keyboard, etc.)
      ├─ infrastructure/           # Détails techniques (APIs, DB, etc.)
      │  ├─ TrouveMotGateway.ts
      │  ├─ FrenchDictionaryGateway.ts
      │  ├─ DictionaryApiGateway.ts
      │  ├─ DicolinkGateway.ts
      │  ├─ LeaderboardMongoRepository.ts
      │  └─ mongodb.ts
      ├─ styles/                   # Styles globaux
      ├─ container.ts              # Composition Root (factories)
      └─ index.ts
```

Côté Next.js (`/app`):
- `app/layout.tsx` importe `src/frameworks/drivers/styles/globals.css` et réexporte la `RootLayout`.
- `app/page.tsx` réexporte `HomePage`.
- `app/api/*` réexporte les handlers de `src/frameworks/drivers/http/*`.
- `app/play/*` réexporte les pages de `src/frameworks/drivers/pages/*`.

---

## Installation et lancement

```bash
npm install
npm run dev
# ouvrir http://localhost:3000
```

Variables d’environnement (si vous activez le leaderboard MongoDB) :
- MONGODB_URI: chaîne de connexion MongoDB
- MONGODB_DB: nom de la base (par défaut: thysmots)

---

## Scripts NPM

- dev: démarre Next.js en développement
- build: build de production
- start: démarre le serveur de prod
- lint: exécute ESLint
- test: lance Jest

```bash
npm run dev
npm run build && npm start
npm run lint
npm test
```

---

## Tests (Jest + React Testing Library)

Jest est configuré avec:
- testEnvironment jsdom (tests UI), avec override par fichier si besoin (`/** @jest-environment node */`) pour les handlers serveur.
- setupFilesAfterEnv: jest.setup.ts (inclut @testing-library/jest-dom)

Exécuter les tests:
```bash
npm test
# ou en watch
npx jest --watch
```

Couverture de tests ajoutée:
- Domaine
  - `src/domain/services/evaluate.spec.ts` — vérifie l’évaluation des lettres (correct/present/absent)
- Cas d’usage
  - `src/app/use_cases/ValidateWordUseCase.spec.ts`
  - `src/app/use_cases/ListLeaderboardUseCase.spec.ts`
  - `src/app/use_cases/SubmitScoreUseCase.spec.ts`
- Infrastructure
  - `src/frameworks/drivers/infrastructure/LeaderboardMongoRepository.spec.ts` (mock de `mongodb.ts`)
  - `src/frameworks/drivers/infrastructure/FrenchDictionaryGateway.spec.ts` (mock de `fetch`)
- HTTP handlers
  - `src/frameworks/drivers/http/leaderboard.spec.ts` (mock du container)
  - `src/frameworks/drivers/http/validateWord.spec.ts` (mock du container)
- Pages UI
  - `src/frameworks/drivers/pages/EndlessGame.spec.tsx` (tests de rendu basiques + états erreur)

Toutes les suites sont au vert: 9 suites, 24 tests.

---

## Détails par couche

- Domain: logique pure (aucune dépendance vers Next/React/DB). Fournit des ports (interfaces) implémentés par la couche infra.
- App/use_cases: orchestre les ports du domaine pour exposer des actions applicatives (ex: valider un mot, lister le leaderboard).
- Frameworks/drivers: détails techniques (handlers Next.js, composants React, accès DB/API, styles). La composition des use cases/adapters se fait dans `container.ts`.

---
