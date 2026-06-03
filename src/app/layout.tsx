import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "../components/SiteChrome";
import  WhatsAppButton from "@/src/components/WhatsAppButton/WhatsAppButton"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const poppins = Poppins({
  variable: "--font-site",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karisimbi Real Estate",
  description: "Karisimbi Real Estate - Your Dream Home Awaits",
  icons:{
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteChrome>{children}</SiteChrome>
          <ToastContainer position="top-right" autoClose={3000} />
          <WhatsAppButton/>
      </body>
    </html>
  );
}
