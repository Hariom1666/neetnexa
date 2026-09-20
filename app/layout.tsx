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
      <body>
        <header
          style={{
            background: "#fff",
            borderBottom: "1px solid #e6eaf0",
          }}
        >
          <div
            className="container"
            style={{
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: 23,
                fontWeight: 900,
                color: "#176bff",
              }}
            >
              Neet Nexa
            </Link>

            <nav
              style={{
                display: "flex",
                gap: 18,
                alignItems: "center",
              }}
            >
              <Link href="/tests">Tests</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/login" className="btn btn-primary">
                Login
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer
          style={{
            marginTop: 60,
            padding: "28px 0",
            borderTop: "1px solid #e6eaf0",
            background: "#fff",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <span>© {new Date().getFullYear()} Neet Nexa</span>
            <span>
              Built for focused NEET preparation • Hariom Singh
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}