"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/google/locations")
      .then((r) => r.json())
      .then((data) => setLocations(data.locations || []));
  }, []);

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900">
        Your Businesses on Google
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {locations.map((loc, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-zinc-900 text-lg font-semibold mb-2">
              {loc.title}
            </h2>

            <p className="text-sm text-gray-600">
              {loc.storefrontAddress?.addressLines?.join(", ")}
            </p>

            <p className="mt-2 text-sm">
              📞 {loc.phoneNumbers?.primaryPhone}
            </p>

            <p className="mt-2 text-sm text-blue-600">
              {loc.websiteUri}
            </p>

            <div className="mt-4">
              <Link
                href={`/dashboard/reviews?location=${loc.name}`}
                className="text-sm text-white bg-black px-3 py-2 rounded-lg"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}