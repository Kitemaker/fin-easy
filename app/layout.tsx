import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinEasy — AI Personal Finance Agent",
  description: "AI-powered personal finance management using Auth0 Token Vault for secure, user-controlled agent authorization.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='url(%23g)'/><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%238b5cf6'/><stop offset='100%25' stop-color='%236d28d9'/></linearGradient></defs><rect x='2' y='20' width='6' height='10' rx='1.5' fill='white' fill-opacity='0.65'/><rect x='13' y='13' width='6' height='17' rx='1.5' fill='white' fill-opacity='0.85'/><rect x='24' y='4' width='6' height='26' rx='1.5' fill='white'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
