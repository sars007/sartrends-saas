'use client';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setResult("Generated marketing content for: " + input);
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>AI Marketing</h1>

      <div style={{ marginTop: 20 }}>
        <textarea
          placeholder="Enter your product or idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '100%', height: 100, padding: 10 }}
        />

        <button
          onClick={generate}
          style={{ marginTop: 10, padding: '8px 16px' }}
        >
          Generate
        </button>

        {result && (
          <div style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
