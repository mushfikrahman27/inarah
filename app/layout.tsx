import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import FloatingContact from "../components/FloatingContact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Providers from "../components/Providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "INARAH || MB",
  description: "Curated luxury for the modern individual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <FloatingContact />
        </Providers>
      </body>
    </html>
  );
}
