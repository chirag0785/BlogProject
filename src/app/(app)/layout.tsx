import type { Metadata } from "next";

import ".././globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog Creator",
  description: "Blog Creator , write blogs effortlesly",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <AuthProvider>
      <div className="w-full min-h-screen bg-slate-100 dark:bg-gray-900">
        <div className="fixed w-full top-0">
          <Navbar />
        </div>
        <div className="w-full mt-16 mb-20">{children}</div>
        <Toaster />
        <div className="fixed w-full bottom-0">
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
