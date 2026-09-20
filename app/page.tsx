'use client';

import Link from 'next/link';

const chapters = [
  'Physics and Measurement',
  'Kinematics',
  'Laws of Motion',
  'Work, Energy and Power',
  'Rotational Motion',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-400">NEET Nexa</h1>
            <p className="text-gray-400 text-sm mt-1">Targeted Physics & Chemistry Test Platform</p>
          </div>
          <Link
            href="/admin1666"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition text-sm shadow"
          >
            Admin Uploader
          </Link>
        </header>

        {/* Chapter Selection Grid */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-200">Select a Chapter to Start Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((chapter) => (
              <Link
                key={chapter}
                href={`/tests/${encodeURIComponent(chapter)}`}
                className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-blue-500 transition shadow-md flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-400 transition">{chapter}</h3>
                  <p className="text-xs text-gray-400 mt-1">45 High-Yield Questions • +4 / -1 Marking</p>
                </div>
                <span className="text-blue-500 font-bold group-hover:translate-x-1 transition text-xl">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}