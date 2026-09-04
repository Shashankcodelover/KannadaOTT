import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { WatchedProvider } from '@/context/WatchedContext';
import WatchedDraftsModal from '@/components/WatchedDraftsModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KannadaOTT — Find Movies in Kannada on Indian OTTs',
  description:
    'Discover the best movies available on JioHotstar, Zee5, SonyLIV, and JioCinema in Kannada audio.',
  keywords: ['Kannada movies', 'OTT India', 'JioHotstar', 'Zee5', 'SonyLIV', 'JioCinema'],
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-black text-white min-h-screen antialiased`}>
        <WatchedProvider>
          <Navbar />
          <WatchedDraftsModal />
          <main>{children}</main>
        </WatchedProvider>
        <footer className="border-t border-zinc-900 mt-16 py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-zinc-600 text-sm">
            Movie data powered by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors underline"
            >
              TMDB
            </a>
            {' & '}
            <a
              href="https://www.justwatch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors underline"
            >
              JustWatch
            </a>
            . Built personally for Kannada movie lovers. 🎬
          </p>
        </footer>
      </body>
    </html>
  );
}
