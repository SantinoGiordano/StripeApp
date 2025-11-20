"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  async function upload() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div className="p-10 text-black">
      <h1 className="text-2xl font-bold mb-4">Upload MP3</h1>

      <input
        type="file"
        accept=".mp3"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={upload}
        className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
      >
        Upload
      </button>

      {result && (
        <pre className="mt-6 bg-white p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
