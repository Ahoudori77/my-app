// src/pages/_app.tsx
import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from 'next/app';
import '@/styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
