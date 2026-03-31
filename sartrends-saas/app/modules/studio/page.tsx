"use client";

import Link from "next/link";

export default function AIStudio() {
  return (
    <div>
      <div className="p-6">
        Studio page
      </div>
      <Link href="/dashboard" className="text-blue-600 underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
