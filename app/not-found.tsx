import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-4xl md:text-6xl font-black text-white mb-4">404</h2>
      <h3 className="text-xl md:text-2xl font-bold text-zinc-300 mb-6">Page Not Found</h3>
      <p className="text-zinc-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
