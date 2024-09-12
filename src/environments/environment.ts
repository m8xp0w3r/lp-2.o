// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'latschi-pansch-aac2a',
    appId: '1:953003772894:web:d3d1d4fd0d496e94d8eb4f',
    storageBucket: 'latschi-pansch-aac2a.appspot.com',
    apiKey: 'AIzaSyB00Cmkg1n_5-XDAjey6ReK2NVpCHpMIog',
    authDomain: 'latschi-pansch-aac2a.firebaseapp.com',
    messagingSenderId: '953003772894',
  },
  production: false,
  testMode: true,
  latschiPanschCollectionName: "panschDev",
  loginName: "pansch@pansch.de",
  loginPassword: "panschpansch",
  localDevMode: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
