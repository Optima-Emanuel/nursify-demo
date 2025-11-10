import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import env from '@/lib/env';
import { getFeatures } from "@/lib/features";

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const features = await getFeatures();

  return (
    <html lang="de">
      <body>
        <nav className="border-b border-gray-200 px-4 py-1 bg-gray-50">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-600 hover:text-gray-900 hover:underline">
              Home
            </Link>
            <Link href="/dev" className="text-xs text-gray-600 hover:text-gray-900 hover:underline">
              Dev
            </Link>
          </div>
        </nav>
        <header className="border-b">
          <div className="max-w-5xl mx-auto flex items-center gap-4 p-3 text-sm">
            <a href="/" className="font-semibold">Nursify Demo</a>
            <nav className="flex gap-3">
              <a href="/dev" className="opacity-70 hover:opacity-100">Dev</a>
              {features.lesson && <a href="/lesson" className="opacity-70 hover:opacity-100">Lesson</a>}
              {features.dialog && <a href="/dialog" className="opacity-70 hover:opacity-100">Dialog</a>}
              {features.test && <a href="/test" className="opacity-70 hover:opacity-100">Test</a>}
            </nav>
            <div className="ml-auto text-xs opacity-60">
              Flags: L={String(features.lesson)} D={String(features.dialog)} T={String(features.test)}
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
