import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-sage px-6 font-semibold text-white">Back to WeddingWell</Link>
    </main>
  );
}
