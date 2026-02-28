"use client";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Vipprow Business Manager
        </h1>

        <a
          href="/api/auth/google"
          className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-white transition hover:bg-gray-800"
        >
          Continue with Google
        </a>

        <p className="mt-4 text-center text-sm text-gray-500">
          Manage your Google Business Profile securely.
        </p>
      </div>
    </div>
  );
}
