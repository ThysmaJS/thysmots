# Thysmots - Clean Architecture

Projet structuré selon Clean Architecture.

## Structure actuelle

```
src/
├── domain/
│   ├── entities/
│   ├── services/
│   ├── valueObjects/
│   └── ports/                 # Interfaces (ports) côté domaine
├── application/
│   └── use_cases/             # Cas d'usage (orchestration)
└── frameworks/
    └── drivers/
        ├── ui/                # UI (React components)
        ├── pages/             # Composants de page (utilisés par app/*)
        ├── http/              # Handlers HTTP exportés par app/api/*
        └── infrastructure/    # Adapters techniques (gateways, repos, mongodb)
```

- app/ (Next.js) ne contient que le strict minimum (stubs de routes, layout et pages réexportées):
  - app/layout.tsx importe `src/frameworks/drivers/styles/globals.css` et réexporte RootLayout.
  - app/page.tsx réexporte `HomePage`.
  - app/api/* réexportent les handlers de `src/frameworks/drivers/http/*`.
  - app/play/* réexportent des pages de `src/frameworks/drivers/pages/*`.

## Démarrage

```bash
npm install
npm run dev
```

## Principes

- Domain pur, aucune dépendance vers l'extérieur.
- Application dépend uniquement du domain (ports + use cases).
- Frameworks/drivers contient les détails techniques (Next.js, DB, API externes).
- Les routes Next.js ne font que déléguer à des handlers dans `src/`.

## Factories (Composition Root)

`src/frameworks/drivers/container.ts` assemble les use cases et leurs adapters (gateways/repos) :
- GetDailyWordUseCase, GetRandomWordUseCase, ValidateWordUseCase
- ListLeaderboardUseCase, SubmitScoreUseCase

## Nettoyage

- Anciens alias adapters/* et presentation/* supprimés de tsconfig.
- Anciens dossiers non utilisés à supprimer manuellement si encore présents.
