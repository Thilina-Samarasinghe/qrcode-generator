import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'QR Events — Create & Share Event QR Tickets',
  description:
    'Create events, generate QR code tickets instantly, and let attendees scan to verify.',
  keywords: ['QR code', 'event', 'ticket', 'scanner', 'NestJS', 'Next.js'],
  authors: [{ name: 'QR Events' }],
  openGraph: {
    title: 'QR Events',
    description: 'Create events with instant QR tickets',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a2e',
              color: '#e2e8f0',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '12px',
              fontFamily: 'var(--font-outfit)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
