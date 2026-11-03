import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "LaporWarga | Platform Laporan Infrastruktur",
  description: "Laporkan masalah infrastruktur di lingkungan Anda",
  icons: {
    icon: [
      { url: "/favicon.jpe", type: "image/jpeg", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}
