import { Footer, Header } from "./site-chrome";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-2xl px-5 py-12 leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3">
        <h1 className="font-serif text-4xl font-medium text-ink">{title}</h1>
        {children}
      </main>
      <Footer />
    </>
  );
}
