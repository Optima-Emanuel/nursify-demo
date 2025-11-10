'use client';

import { useState, useRef } from 'react';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export default function DevSTTPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [lang, setLang] = useState('de');
  const [transcript, setTranscript] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileSizeWarning, setFileSizeWarning] = useState<string | null>(null);
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const sendAudio = async (audioFile: File | Blob, fileName: string = 'audio') => {
    setLoading(true);
    setError(null);
    setTranscript(null);
    setFileSizeWarning(null);

    // Check file size
    if (audioFile.size > MAX_BYTES) {
      setFileSizeWarning(`File size (${(audioFile.size / 1024 / 1024).toFixed(2)} MB) exceeds 4 MB limit.`);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioFile, fileName);
      formData.append('lang', lang);

      const res = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(JSON.stringify(data, null, 2));
      } else {
        setTranscript(data.transcript);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setFileSizeWarning(`File size (${(file.size / 1024 / 1024).toFixed(2)} MB) exceeds 4 MB limit.`);
      return;
    }

    setFileSizeWarning(null);
    sendAudio(file, file.name);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('Failed to access microphone: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendRecording = () => {
    if (recordedBlob) {
      sendAudio(recordedBlob, 'recording.webm');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">STT Dev Tool</h2>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'upload'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('record')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'record'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Record
            </button>
          </div>

          {/* Language input (shared) */}
          <div className="mb-4">
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

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="audioFile" className="block text-sm font-medium mb-1">
                  Audio File
                </label>
                <input
                  id="audioFile"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
              {fileSizeWarning && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                  {fileSizeWarning}
                </div>
              )}
            </div>
          )}

          {/* Record Tab */}
          {activeTab === 'record' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Stop Recording
                  </button>
                )}
                {recordedBlob && !isRecording && (
                  <button
                    onClick={handleSendRecording}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Recording'}
                  </button>
                )}
              </div>
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Recording...</span>
                </div>
              )}
              {recordedBlob && !isRecording && (
                <div className="text-sm text-gray-600">
                  Recording ready ({((recordedBlob.size / 1024 / 1024).toFixed(2))} MB)
                  {recordedBlob.size > MAX_BYTES && (
                    <span className="text-yellow-600 ml-2">
                      (Warning: exceeds 4 MB limit)
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {error && (
          <section>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Error</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              <code>{error}</code>
            </pre>
          </section>
        )}

        {transcript && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{transcript}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

