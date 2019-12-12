# PupMoney Progressive Web App (PWA)
Under development using Ionic 4 and Angular 7




## Build and Serve
To serve or build for dev, beta or prod change the value of the BACKEND env.

For ionic **serve** in src/environment.ts as follows;
For ionic **build** in src/environment.prod.ts as follows;

```typescript
// Set in environemnet file
export const BACKEND = beta; // or dev, prod
```

**Build** with the --prod flag for beta and prod.

```bash
ionic build --prod
OR
npm run ionic:build --prod
```

**Serve** for dev, beta and prod BACKEND.url.

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
firebase use pupmoney-beta # or pupmoney-prod 
firebase deploy
# OR 
firebase deploy -m "Deploying the best new feature ever."

=== Deploying to 'pupmoney-beta'...

i  deploying hosting
i  hosting[pupmoney-beta]: beginning deploy...
i  hosting[pupmoney-beta]: found 1 files in public
✔  hosting[pupmoney-beta]: file upload complete
i  hosting[pupmoney-beta]: finalizing version...
✔  hosting[pupmoney-beta]: version finalized
i  hosting[pupmoney-beta]: releasing new version...
✔  hosting[pupmoney-beta]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/pupmoney-beta/overview
Hosting URL: https://pupmoney-beta.firebaseapp.com
```

## PWA Links 


https://www.netguru.com/codestories/few-tips-that-will-make-your-pwa-on-ios-feel-like-native

https://www.smashingmagazine.com/2018/09/pwa-angular-6/

Generate PWA icons:
https://app-manifest.firebaseapp.com/

Generate PWA Splashscreens
https://appsco.pe/developer/splash-screens

PWA updates
https://medium.com/progressive-web-apps/pwa-create-a-new-update-available-notification-using-service-workers-18be9168d717
