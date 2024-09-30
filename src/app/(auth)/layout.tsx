import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import ".././globals.css";
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
          {children}
          <Toaster />
      </AuthProvider>
  );
}
