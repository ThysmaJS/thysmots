# Thysmots - Clean Architecture

Projet utilisant l'architecture Clean Architecture (Uncle Bob Martin).

## Structure

```
src/
├── domain/
│   └── entities/          # Entités métier et logique pure
├── app/
│   └── use_cases/         # Cas d'usage et logique applicative  
├── adapters/
│   └── infrastructure/    # Contrôleurs, repositories, gateways
└── frameworks/
    └── drivers/           # Implémentations techniques (HTTP, DB, UI)
```

## Démarrage

```bash
npm install
npm run dev
```

## Principes

- **Domain**: Logique métier pure, indépendante
- **Application**: Orchestration des entités  
- **Adapters**: Interface entre app et frameworks
- **Frameworks**: Détails techniques (Next.js, DB, etc.)

Les dépendances pointent vers l'intérieur.
