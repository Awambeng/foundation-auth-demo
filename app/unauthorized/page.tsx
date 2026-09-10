import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-4 text-gray-600 max-w-md">
        You don&apos;t have permission to access this page.
      </p>
      <Link
        href="/donations"
        className="mt-8 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
      >
        Back to Donations
      </Link>
    </div>
  );
}
