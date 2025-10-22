/*
  Usage:
    1) Place your Firebase service account JSON at the project root or provide a path.
    2) Run: node scripts/set-admin-claim.js --email user@example.com --admin true

  This script sets or removes the `admin` custom claim for a user using Firebase Admin SDK.
*/

const path = require('path');
const admin = require('firebase-admin');
const argv = require('minimist')(process.argv.slice(2));

const serviceAccountPath = argv.key || path.join(__dirname, '..', 'serviceAccountKey.json');

if (!argv.email) {
  console.error('Error: --email is required');
  process.exit(1);
}

const makeAdmin = argv.admin === 'true' || argv.admin === true;

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  console.error('Failed to load service account key from', serviceAccountPath);
  console.error(err.message || err);
  process.exit(1);
}

const email = argv.email;

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('Found user:', user.uid, user.email);
    const claims = makeAdmin ? { admin: true } : { admin: false };
    await admin.auth().setCustomUserClaims(user.uid, claims);
    console.log(`Set admin=${makeAdmin} for ${email}`);
    console.log('Note: clients will see the updated claims after the user signs in again or you refresh their ID token.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to set custom claims:', err.message || err);
    process.exit(2);
  }
})();
