'use client';

import { useState } from 'react';

export default function DevChatPage() {
  const [scene, setScene] = useState('Medikamentengabe');
  const [lang, setLang] = useState('de');
  const [user, setUser] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scene,
          lang,
          user,
        }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Chat Dev Tool</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="scene" className="block text-sm font-medium mb-1">
                Scene
              </label>
              <input
                id="scene"
                type="text"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="lang" className="block text-sm font-medium mb-1">
                Language
              </label>
              <input
                id="lang"
                type="text"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="user" className="block text-sm font-medium mb-1">
                User Message
              </label>
              <textarea
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </section>

        {error && (
          <section>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
            <p className="text-sm text-red-600">{error}</p>
          </section>
        )}

        {response && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              <code>{response}</code>
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}

