#!/usr/bin/env node
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Usage: node ./scripts/set-admin-claim.ts <uid>
// or set env SERVICE_ACCOUNT_PATH to a service account JSON and pass uid as arg

async function main() {
  const uid = process.argv[2];
  const serviceAccountPath = process.env.SERVICE_ACCOUNT_PATH || path.resolve(process.cwd(), 'serviceAccountKey.json');

  if (!uid) {
    console.error('Usage: node scripts/set-admin-claim.ts <uid>');
    process.exit(1);
  }

  if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account JSON not found at', serviceAccountPath);
    console.error('Set SERVICE_ACCOUNT_PATH or place serviceAccountKey.json in project root.');
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Successfully set admin claim for UID: ${uid}`);
  } catch (err) {
    console.error('Failed to set admin claim:', err);
    process.exit(1);
  }
}

main();
