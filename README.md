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
OR
npm run ionic:build --prod
```

**Serve** for dev, stage and prod BACKEND.url.

```bash
ionic serve -c 
```


## Deploy to Firebase Hosting
Best tutorial on setting up an Ionic project for Firebase hosting.
# setup new project
```bash
firebase init
```

https://www.joshmorony.com/hosting-an-ionic-pwa-with-firebase-hosting/

Be sure to set the environment to stage or prod then build the app first. Then be sure the
desired version numbers are set.

```bash
cd www
# Show the current project
firebase list 
# Change project if needed
firebase use pupmoney-stage
firebase deploy
# OR 
firebase deploy -m "Deploying the best new feature ever."

=== Deploying to 'pupmoney-stage'...

i  deploying hosting
i  hosting[pupmoney-stage]: beginning deploy...
i  hosting[pupmoney-stage]: found 1 files in public
✔  hosting[pupmoney-stage]: file upload complete
i  hosting[pupmoney-stage]: finalizing version...
✔  hosting[pupmoney-stage]: version finalized
i  hosting[pupmoney-stage]: releasing new version...
✔  hosting[pupmoney-stage]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/pupmoney-stage/overview
Hosting URL: https://pupmoney-stage.firebaseapp.com
```

## PWA Links 


https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native

https://www.smashingmagazine.com/2018/09/pwa-angular-6/

Generate PWA icons:
https://app-manifest.firebaseapp.com/

Generate PWA Splashscreens
https://appsco.pe/developer/splash-screens