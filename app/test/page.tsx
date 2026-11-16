"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [mounted, setMounted] = useState(false);
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    setMounted(true);
    setEnvVars({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    });
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Debug Test Page</h1>
      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>
      
      <h2>Basic Tests:</h2>
      <ul>
        <li>✅ React is working</li>
        <li>✅ Client-side JavaScript is working</li>
        <li>✅ useEffect hook is working</li>
        <li>✅ State management is working</li>
      </ul>

      <h2>Navigation Test:</h2>
      <a href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Back to Home
      </a>
    </div>
  );
}