import Link from 'next/link';

export default function DevPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Development Tools</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/api/health" className="text-blue-600 hover:underline">
                /api/health
              </Link>
              <span className="text-sm text-gray-600 ml-2">(opens JSON)</span>
            </li>
            <li>
              <Link href="/dev/chat" className="text-blue-600 hover:underline">
                /dev/chat
              </Link>
            </li>
            <li>
              <Link href="/dev/tts" className="text-blue-600 hover:underline">
                /dev/tts
              </Link>
            </li>
            <li>
              <Link href="/dev/stt" className="text-blue-600 hover:underline">
                /dev/stt
              </Link>
            </li>
            <li>
              <Link href="/dev/score" className="text-blue-600 hover:underline">
                /dev/score
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <p className="text-sm text-gray-600">
            Mocks: CHAT={process.env.NEXT_PUBLIC_ENABLE_MOCK_CHAT}, TTS={process.env.NEXT_PUBLIC_ENABLE_MOCK_TTS}, STT={process.env.NEXT_PUBLIC_ENABLE_MOCK_STT}
          </p>
        </section>
      </div>
    </main>
  );
}

