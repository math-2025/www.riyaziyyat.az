import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseConfig } from './config';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

// Initialize Firebase Analytics
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, db, analytics };
