import Link from 'next/link';
import env from '@/lib/env';
import { SUPPORTED_LANGS } from '@/config/app';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-2">App Name</h2>
          <p className="text-lg">{env.NEXT_PUBLIC_APP_NAME}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">Supported Languages</h2>
          <ul className="list-disc list-inside space-y-1">
            {SUPPORTED_LANGS.map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">API Endpoints</h2>
          <div className="space-y-2">
            <div>
              <Link href="/api/health" className="text-blue-600 hover:underline">
                /api/health
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Note: APIs are stubbed (501)
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
