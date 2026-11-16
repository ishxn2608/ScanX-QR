#!/bin/bash

# Remove existing variables first
echo "Removing existing variables..."
vercel env rm NEXT_PUBLIC_FIREBASE_API_KEY production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_FIREBASE_PROJECT_ID production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_FIREBASE_APP_ID production --yes 2>/dev/null
vercel env rm NEXT_PUBLIC_APP_URL production --yes 2>/dev/null

echo ""
echo "Adding new variables..."

# Add variables for production only
printf "AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s" | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production --force
printf "qr-verification-7fe0c.firebaseapp.com" | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production --force
printf "qr-verification-7fe0c" | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production --force
printf "qr-verification-7fe0c.firebasestorage.app" | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production --force
printf "140713435971" | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production --force
printf "1:140713435971:web:f6e2bee4cb5adafbed45f6" | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production --force
printf "https://secure-upi-payment.vercel.app" | vercel env add NEXT_PUBLIC_APP_URL production --force

echo ""
echo "Done! Now run: vercel --prod"
