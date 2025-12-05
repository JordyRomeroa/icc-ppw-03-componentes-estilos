import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';   // ✅ FALTA ESTO

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch()),

    //  Registrar Firebase App
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),

    //  Registrar Firebase Auth
    provideAuth(() => getAuth()),

    //  Registrar Firestore (IMPORTANTE)
    provideFirestore(() => getFirestore())    // 🔥 SIN ESTO NO FUNCIONA
  ]
};
