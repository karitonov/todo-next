import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TODO App",
  description: "シンプルなTODOアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900" suppressHydrationWarning>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-center">TODO App</h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
