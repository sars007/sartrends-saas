'use client';
import Link from 'next/link';

export default function Page() {
  return (
    <main style={{ padding: 20 }}>
      <h1>AI Tools</h1>

      <div style={{ marginTop: 20 }}>
        <div style={{ padding: 10, border: '1px solid #ccc', marginBottom: 10 }}>
          <h3>Marketing AI</h3>
          <p>Generate marketing content</p>

          <Link href="/modules/ai/marketing">
            <button style={{ marginTop: 10, padding: '6px 12px' }}>
              Open Marketing
            </button>
          </Link>
        </div>

        <div style={{ padding: 10, border: '1px solid #ccc', marginBottom: 10 }}>
          <h3>SEO AI</h3>
          <p>Optimize your content</p>
        </div>

        <div style={{ padding: 10, border: '1px solid #ccc' }}>
          <h3>Sales AI</h3>
          <p>Boost conversions</p>
        </div>
      </div>
    </main>
  )
}
