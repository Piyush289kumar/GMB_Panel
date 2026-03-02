// app/dashboard/photos/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function PhotosPage() {
  const params = useSearchParams();
  const locationName = params.get("location");
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!locationName) return;

      const res = await fetch(
        `/api/google/media/list?location=${locationName}`,
      );
      const data = await res.json();
      setMedia(data.media || []);
    };

    fetchMedia();
  }, [locationName]);

  const handleDelete = async (mediaName: string) => {
    if (!confirm("Delete this photo?")) return;

    setLoading(true);

    await fetch("/api/google/media/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaName }),
    });

    setLoading(false);

    if (locationName) {
      const res = await fetch(
        `/api/google/media/list?location=${locationName}`,
      );
      const data = await res.json();
      setMedia(data.media || []);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Photo Management</h1>

        {/* <Link
          href={`/dashboard/photos/upload?location=${locationName}`}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Upload Photo
        </Link> */}

        <button
          onClick={() => setShowUpload(true)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Upload Photo
        </button>
      </div>

      {media.length === 0 && (
        <p className="text-gray-500">No uploaded media found.</p>
      )}

      {showUpload && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload New Photo</h2>

          <input
            type="file"
            accept="image/*"
            className="mb-4"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />

          <div className="flex gap-3">
            <button
              onClick={async () => {
                if (!file) return alert("Select file");

                const formData = new FormData();
                formData.append("file", file);
                formData.append("locationName", locationName!);
                formData.append("category", "ADDITIONAL");

                await fetch("/api/google/media", {
                  method: "POST",
                  body: formData,
                });

                setShowUpload(false);
                setFile(null);
                fetchMedia();
              }}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Upload
            </button>

            <button
              onClick={() => setShowUpload(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.name}
            className="relative bg-white rounded-lg shadow overflow-hidden"
          >
            <Image
              src={item.googleUrl}
              alt="business media"
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
            />

            <button
              onClick={() => handleDelete(item.name)}
              disabled={loading}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
