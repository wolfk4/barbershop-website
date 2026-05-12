import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaiizen Cutz | Sacramento Barbershop",
  description:
    "Kaiizen Cutz is a Sacramento barbershop offering modern haircuts, fades, beard trims, and grooming services in a clean and professional environment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} antialiased`}>
        <main className="pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}