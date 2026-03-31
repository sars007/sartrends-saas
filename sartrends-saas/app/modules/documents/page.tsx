"use client";

import Link from "next/link";
import { useState } from "react";

export default function DocumentGenerator() {
  const [docType, setDocType] = useState("proposal");
  const [prompt, setPrompt] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateDocument = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: docType }),
      });

      const data = await response.json();
      if (!response.ok) {
        setContent(data.error || "Error generating document.");
        return;
      }

      setContent(data.response || "");
    } catch (error) {
      setContent("Error generating document.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = () => {
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType}-document.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">AI Document Generator</h1>
          <p className="text-gray-600">Generate polished business documents instantly.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Input</h2>

            <label className="block mb-2 text-sm font-medium">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="proposal">Proposal</option>
              <option value="invoice">Invoice Notes</option>
              <option value="contract">Contract Draft</option>
              <option value="report">Business Report</option>
            </select>

            <label className="block mb-2 text-sm font-medium">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what document you need..."
              className="w-full p-3 border rounded-lg h-40 resize-none"
            />

            <button
              onClick={generateDocument}
              disabled={isLoading || !prompt.trim()}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg"
            >
              {isLoading ? "Generating..." : "Generate Document"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Output</h2>
            <div className="h-72 border rounded-lg p-4 bg-gray-50 overflow-auto whitespace-pre-wrap">
              {content || "Generated document will appear here..."}
            </div>

            <button
              onClick={downloadDocument}
              disabled={!content}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg"
            >
              Download
            </button>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
