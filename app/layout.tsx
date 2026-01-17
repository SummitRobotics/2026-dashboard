import "./globals.css";

import Navbar from "@/app/components/nav"; 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex"> 
        {/* Navbar is here once. It stays mounted during navigation. */}
        <Navbar /> 
        {/* Only this part reloads when you change pages */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
