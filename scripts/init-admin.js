// Script to initialize admin account in Firebase
// Run this once: node scripts/init-admin.js

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const ADMIN_EMAIL = 'admin@secureqr.com';
const ADMIN_PASSWORD = 'Admin@123456'; // Change this to a secure password

async function createAdminAccount() {
  try {
    // Create admin user
    const userRecord = await admin.auth().createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      emailVerified: true,
    });

    console.log('✅ Admin account created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('UID:', userRecord.uid);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('ℹ️  Admin account already exists');
    } else {
      console.error('❌ Error creating admin:', error);
    }
  }
  
  process.exit(0);
}

createAdminAccount();
