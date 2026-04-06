'use client';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    const res = await fetch('/api/ai/marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>AI Marketing</h1>

      <textarea
        placeholder="Enter your product..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', height: 100 }}
      />

      <button onClick={generate} style={{ marginTop: 10 }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          {result}
        </div>
      )}
    </main>
  );
}
