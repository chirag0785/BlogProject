import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://collab-blogging-hub.vercel.app'),
  keywords: [
    "Blog Creator",
    "blogcreator",
    "blogging",
    "collaborative",
    "write and edit blogs",
    "CollabBloggingHub",
    "collab-blogging-hub"
  ],
  title: {
    default: "CollabBloggingHub",
    template: "%s | Collab Blogging Hub"
  },
  openGraph: {
    description: "For collaborative blogging, write and edit blogs effortlessly with ease",
    images: [""],
  },
  description: "Blog Creator, write blogs effortlessly",
  other: {
    "google-site-verification": "XHEZ-2Jfp-Y6WBlzhezpVOxa8A7oB6VRKhmztZql6Xc"
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head /> 
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
