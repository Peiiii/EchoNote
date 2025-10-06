import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, browserLocalPersistence, connectAuthEmulator, getAuth, initializeAuth } from 'firebase/auth';
import { Firestore, initializeFirestore } from 'firebase/firestore';

interface FirebaseConfigOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const PROXY_URL_AUTH = 'https://firebase-auth-api.agentverse.cc';
const PROXY_HOST_API = 'firebase-api.agentverse.cc';


const config: FirebaseConfigOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(config);
const db = initializeFirestore(app, {
  host: PROXY_HOST_API,
  ssl: true,
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: false,
});

const tryLoadRegionFromLocalStorage = (defaultRegion: string): string => {
  const region = localStorage.getItem('region');
  if (region) {
    return region;
  }
  return defaultRegion;
}


const saveRegionToLocalStorage = (region: string): void => {
  localStorage.setItem('region', region);
}


const CN_REGION = "CN";


export class FirebaseConfig {
  private static instance: FirebaseConfig | null = null;
  private app: FirebaseApp = app;
  private auth: Auth | null = null;
  private db: Firestore = db;
  private region: string = tryLoadRegionFromLocalStorage(CN_REGION);
  private constructor() {
    console.log('[FirebaseConfig] constructor, region', this.region);
    this.getAuth();
    this.validateRegionAndMaybeReloadPage();
  }

  static getInstance(): FirebaseConfig {
    if (!FirebaseConfig.instance) {
      FirebaseConfig.instance = new FirebaseConfig();
    }
    return FirebaseConfig.instance;
  }


  getApp(): FirebaseApp {
    return this.app;
  }

  /**
   * 
   * @returns true if the region is CN
   * not support google auth in this region
   */
  isInCNRegion(): boolean {
    return this.region === CN_REGION;
  }

  supportGoogleAuth(): boolean {
    return !this.isInCNRegion();
  }

  private async fetchRegion(): Promise<string> {
    let country = '';
    try {
      const response = await fetch(`${PROXY_URL_AUTH}/api/location`);
      if (response.ok) {
        country = (await response.json()).country || 'XX';
      }
    } catch (e) {
      console.error('Failed to fetch user country, using restricted auth.', e);
    }
    return country;
  }


  private async validateRegionAndMaybeReloadPage(): Promise<void> {
    const region = await this.fetchRegion();
    saveRegionToLocalStorage(region);
    if(region !== this.region) {
      window.location.reload();
    }
  }


   getAuth(): Auth {
    if (!this.auth) {
      if (this.isInCNRegion()) {
        this.auth = initializeAuth(this.getApp(), {
          persistence: browserLocalPersistence
        });
      } else {
        this.auth = getAuth(this.getApp());
      }

      connectAuthEmulator(this.auth, PROXY_URL_AUTH, {
        disableWarnings: true
      });
    }
    return this.auth;
  }

  getDb(): Firestore {
    return this.db;
  }
}

export const firebaseConfig = FirebaseConfig.getInstance();