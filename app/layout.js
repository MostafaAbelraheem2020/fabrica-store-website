import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header/Header";
import Footer from "./_components/footer/Footer";

import { AuthProvider } from "./lib/authenticationApi";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  title: "متجر فابريكا",
  description: "أفضل المنتجات بأفضل الأسعار",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
