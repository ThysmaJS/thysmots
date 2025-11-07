# Thysmots - Clean Architecture

Projet structuré selon Clean Architecture.

## Structure actuelle

```
src/
├── domain/                   # Entités, services, value objects, ports (interfaces)
├── app/
│   └── use_cases/            # Cas d'usage (orchestration entre domaine et adapters)
└── frameworks/
    └── drivers/
        ├── ui/               # UI (React components purs)
        ├── pages/            # Composants de page (réexportés par app/* Next.js)
        ├── http/             # Handlers HTTP (utilisés par app/api/*)
        ├── infrastructure/   # Adapters techniques (gateways, repos, mongodb)
        └── styles/           # Styles globaux
```

- `app/` (racine Next.js) ne contient que le strict minimum (layout + pages et routes qui réexportent la logique de `src/`).
- Les gateways / repos techniques sont sous `src/frameworks/drivers/infrastructure`.
- Les cas d'usage sont sous `src/app/use_cases`.

## Principes

- Domaine pur (aucune dépendance externe).
- Les use cases dépendent uniquement du domaine (ports + modèles). Ils n'importent pas Next.js / React.
- Les frameworks & drivers encapsulent l'infrastructure (HTTP, DB, APIs externes, UI, pages Next.js).
- Les couches sont reliées via le container (`src/frameworks/drivers/container.ts`).

## Factories (Composition Root)

`src/frameworks/drivers/container.ts` assemble les use cases et leurs adapters :
- GetDailyWordUseCase, GetRandomWordUseCase, ValidateWordUseCase
- ListLeaderboardUseCase, SubmitScoreUseCase

## Tests

Jest est configuré pour les tests unitaires.

Scripts disponibles :
```bash
npm test            # lance Jest une fois
npx jest --watch    # mode watch (ou ajouter un script test:watch)
npm run lint        # lint du projet
```

Exemples :
- `src/domain/services/evaluate.spec.ts`
- `src/app/use_cases/ValidateWordUseCase.spec.ts`

## Installation & Démarrage

```bash
npm install
npm run dev
```

## Nettoyage réalisé

- Ancien dossier `src/application` supprimé (remplacé par `src/app`).
- Ancien dossier `src/adapters` supprimé (contenu déplacé vers `src/frameworks/drivers/infrastructure`).
- Pages et handlers du dossier `app/` réduits à des réexports.
- Alignement visuel de la page Endless Game.
- Ajout de Jest + tests de base.

## Prochaines pistes

- Couverture de tests supplémentaire sur les gateways.
- Ajout d'un workflow CI (GitHub Actions) pour tests + lint.
- Tests d'intégration des handlers HTTP.
