"use client";
import { useEffect, useState } from "react";

type BlobFile = {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
  name: string;
};

export default function SuccessPage() {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlob() {
      try {
        const res = await fetch("/api/get-blob");
        const data = await res.json();
        setFiles(data); // now an array
      } catch (err) {
        console.error("Failed to fetch blob data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlob();
  }, []);

  if (loading) return <p className="text-black p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-10 text-black">
      <h1 className="text-3xl font-bold mb-6">Your Downloads</h1>

      <div className="space-y-6">
        {files.map((file, index) => (
          <div key={index} className="bg-gray-200 p-4 rounded-xl">
            <p className="mb-2">
              File: <strong>{file.name}</strong>
            </p>

            <a
              href={file.downloadUrl}
              download
              onClick={() => console.log("clicked:", file.name)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block"
            >
              Download MP3
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
