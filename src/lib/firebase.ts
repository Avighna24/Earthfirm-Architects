import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Intercept and suppress noisy Firestore WebChannel 'Listen' stream warnings/errors in the browser console
const suppressFirestoreLogs = () => {
  if (typeof window === 'undefined') return;

  const originalWarn = console.warn;
  const originalError = console.error;

  const shouldSuppress = (args: any[]): boolean => {
    return args.some(arg => {
      if (typeof arg === 'string') {
        const lower = arg.toLowerCase();
        return (
          lower.includes('@firebase/firestore') ||
          lower.includes('webchannelconnection') ||
          lower.includes("rpc 'listen' stream") ||
          lower.includes('transport errored')
        );
      }
      return false;
    });
  };

  console.warn = (...args: any[]) => {
    if (shouldSuppress(args)) return;
    originalWarn.apply(console, args);
  };

  console.error = (...args: any[]) => {
    if (shouldSuppress(args)) return;
    originalError.apply(console, args);
  };
};

suppressFirestoreLogs();

// Suppress internal Firebase warning logs (like WebChannel connection resets/retries)
setLogLevel('error');

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();
