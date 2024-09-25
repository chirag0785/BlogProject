"use client"
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import "../.././globals.css"
interface SetUsernameLayoutProps {
  children: React.ReactNode;
}

export default async function SetUsernameLayout({ children }: SetUsernameLayoutProps) {
  return (
      <AuthProvider>
          {children}
          <Toaster />
      </AuthProvider>
  );
}
