// app/dashboard/photos/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function PhotosPage() {
  const params = useSearchParams();
  const locationName = params.get("location");

  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    if (!locationName) return;

    const res = await fetch(
      `/api/google/media/list?location=${locationName}`
    );
    const data = await res.json();
    setMedia(data.media || []);
  };

  useEffect(() => {
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
    fetchMedia();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Photo Management
        </h1>

        <a
          href={`/dashboard/photos/upload?location=${locationName}`}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Upload Photo
        </a>
      </div>

      {media.length === 0 && (
        <p className="text-gray-500">No uploaded media found.</p>
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