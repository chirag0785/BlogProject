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
            <Navbar/>
          {children}
          
          <Toaster />
            <div className="fixed w-full bottom-0">
              <Footer/>
            </div>
      </AuthProvider>
    
  );
}
