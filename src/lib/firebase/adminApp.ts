import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

export function getAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  const serviceAccount: admin.ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    adminApp = admin.app();
  }

  return adminApp;
}
