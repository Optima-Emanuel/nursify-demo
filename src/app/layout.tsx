import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import env from '@/lib/env';

export const metadata: Metadata = {
  title: env.NEXT_PUBLIC_APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        <header className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{env.NEXT_PUBLIC_APP_NAME}</h1>
            <Link href="/api/health" className="text-sm text-blue-600 hover:underline">
              Health
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
