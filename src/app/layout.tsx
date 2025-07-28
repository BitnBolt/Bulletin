import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Bulletin - Project Management",
  description: "Bulletin is a platform for project management and file sharing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex h-full flex-col bg-gray-50">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <footer className="bg-white py-4 text-center text-sm text-gray-500 shadow-inner">
            <div className="container mx-auto">
              <p>© {new Date().getFullYear()} Bulletin. All rights reserved.</p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
