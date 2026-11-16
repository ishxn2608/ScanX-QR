@echo off
echo Adding environment variables to Vercel...
echo.

echo Adding NEXT_PUBLIC_FIREBASE_API_KEY...
echo AIzaSyDA2MGu7arJFdGj9Kzb3yJv8JEx8gPze7s | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production

echo Adding NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN...
echo qr-verification-7fe0c.firebaseapp.com | vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production

echo Adding NEXT_PUBLIC_FIREBASE_PROJECT_ID...
echo qr-verification-7fe0c | vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production

echo Adding NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET...
echo qr-verification-7fe0c.firebasestorage.app | vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production

echo Adding NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID...
echo 140713435971 | vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production

echo Adding NEXT_PUBLIC_FIREBASE_APP_ID...
echo 1:140713435971:web:f6e2bee4cb5adafbed45f6 | vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production

echo Adding NEXT_PUBLIC_APP_URL...
echo https://secure-upi-payment.vercel.app | vercel env add NEXT_PUBLIC_APP_URL production

echo.
echo Done! Now run: vercel --prod
pause
