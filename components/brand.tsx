export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-tight ${className}`}>
      Wedding<em className="text-sage">Well</em>
    </span>
  );
}
