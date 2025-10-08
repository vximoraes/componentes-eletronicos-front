import "./globals.css";

import Header from "@/components/headerShow/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className="flex"
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header/>
        <main className="flex w-[100%] justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
