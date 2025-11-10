'use client';

import { useState } from 'react';

export default function DevScorePage() {
  const [reference, setReference] = useState('');
  const [transcript, setTranscript] = useState('');
  const [mode, setMode] = useState<'word' | 'char'>('word');
  const [result, setResult] = useState<{
    score: number;
    tips: string[];
    metrics: {
      mode: 'word' | 'char';
      wer?: number;
      cer?: number;
      refTokens?: number;
      hypTokens?: number;
    };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference,
          transcript,
          mode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setResult(data);
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
          <h2 className="text-2xl font-bold mb-4">Score Dev Tool</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reference" className="block text-sm font-medium mb-1">
                Reference
              </label>
              <textarea
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Expected text..."
              />
            </div>

            <div>
              <label htmlFor="transcript" className="block text-sm font-medium mb-1">
                Transcript
              </label>
              <textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Transcribed text..."
              />
            </div>

            <div>
              <label htmlFor="mode" className="block text-sm font-medium mb-1">
                Mode
              </label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as 'word' | 'char')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="word">Word</option>
                <option value="char">Char</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Scoring...' : 'Score'}
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

        {result && (
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Score</h3>
              <div className="text-3xl font-bold text-blue-600">{result.score}</div>
            </div>

            {result.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside space-y-1">
                  {result.tips.map((tip, index) => (
                    <li key={index} className="text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Metrics</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                <code>{JSON.stringify(result.metrics, null, 2)}</code>
              </pre>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

