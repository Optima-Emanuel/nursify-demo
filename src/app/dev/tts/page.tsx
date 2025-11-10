'use client';

import { useState } from 'react';

export default function DevTTSPage() {
  const [text, setText] = useState('Bitte messen Sie den Blutdruck.');
  const [voiceId, setVoiceId] = useState('');
  const [lang, setLang] = useState('de');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAudioSrc(null);

    try {
      const body: { text: string; lang: string; voiceId?: string } = {
        text,
        lang,
      };
      if (voiceId.trim()) {
        body.voiceId = voiceId.trim();
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setAudioSrc(data.audioBase64);
      }
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
          <h2 className="text-2xl font-bold mb-4">TTS Dev Tool</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium mb-1">
                Text
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="voiceId" className="block text-sm font-medium mb-1">
                Voice ID (optional)
              </label>
              <input
                id="voiceId"
                type="text"
                value={voiceId}
                onChange={(e) => setVoiceId(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Speak'}
            </button>
          </form>
        </section>

        {error && (
          <section>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              <code>{error}</code>
            </pre>
          </section>
        )}

        {audioSrc && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Audio</h3>
            <audio controls src={audioSrc} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </section>
        )}
      </div>
    </main>
  );
}

