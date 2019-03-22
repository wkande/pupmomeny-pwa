// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
};

const dev = {
  name:"Dev",
  url:"http://192.168.0.14:3000"
}

const stage = {
  name:"Stage",
  url:"https://pupmoney-backend-stage.herokuapp.com"
}

const prod = {
  name:"Prod",
  url:"?"
}

export const BACKEND = dev;


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
