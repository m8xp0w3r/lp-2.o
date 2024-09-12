/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideFirebaseApp(() => initializeApp({"projectId":"latschi-pansch-aac2a","appId":"1:953003772894:web:d3d1d4fd0d496e94d8eb4f","storageBucket":"latschi-pansch-aac2a.appspot.com","apiKey":"AIzaSyB00Cmkg1n_5-XDAjey6ReK2NVpCHpMIog","authDomain":"latschi-pansch-aac2a.firebaseapp.com","messagingSenderId":"953003772894"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ],
});
