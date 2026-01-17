import "./globals.css";

import Header from "@/app/components/header";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* Header is here once. It stays mounted during app navigation. */}
        <Header />
        {/* Only this part reloads when you change pages */}
        <main className="">
          {children}
        </main>
      </body>
    </html>
  );
}
