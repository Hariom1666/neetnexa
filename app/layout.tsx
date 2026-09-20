import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Neet Nexa — Smart NEET Preparation",
  description:
    "Tests, analytics and personalised NEET preparation.",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col">
        <header className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-extrabold text-blue-500 tracking-wide"
            >
              Neet Nexa
            </Link>

            <nav className="flex gap-6 items-center text-sm font-medium">
              <Link href="/tests" className="hover:text-blue-400 transition">Tests</Link>
              <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
              <Link href="/login" className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition">
                Login
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="mt-auto py-6 border-t border-gray-800 bg-gray-900 text-xs text-gray-400">
          <div className="max-w-7xl mx-auto px-6 flex justify-between gap-4 flex-wrap">
            <span>© {new Date().getFullYear()} Neet Nexa</span>
            <span>Built for focused NEET preparation • Hariom Singh</span>
          </div>
        </footer>
      </body>
    </html>
  );
}