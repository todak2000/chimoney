import "@/app/styles/globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import { config } from "./config";
import TanstackProvider from "./providers/TanstackProvider";
const plus = Plus_Jakarta_Sans({ style: ["normal"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: config.title,
    template: `%s | ${config.title}`,
  },
  description: config.description,
  robots: { index: true, follow: true },
  manifest: `/site.webmanifest`,
  icons: [
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plus.className}>
        <Toaster />
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
