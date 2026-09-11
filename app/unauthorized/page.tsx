import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center text-center mt-20">
      <h1 className="text-3xl font-bold text-red-400">Access Denied</h1>
      <p className="mt-4 text-gray-400 max-w-md">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        href="/"
        className="mt-8 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
