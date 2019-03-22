# PupMoney Progressive Web App (PWA)
Under development using Ionic 4 and Angular 7


## Build and Serve
To serve or build for dev, stage or prod change the value of the BACKEND env.

For ionic **serve** in src/environment.ts as follows;
For ionic **build** in src/environment.prod.ts as follows;

```typescript
export const BACKEND = stage; // or dev, prod
```

**Build** with the --prod flag for stage and prod.

```bash
ionic build --prod
```

**Serve** for dev, stage and prod BACKEND.url.

```bash
ionic serve --address 192.168.3.44
```