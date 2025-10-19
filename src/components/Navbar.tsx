"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useCallback } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { PenLine } from "lucide-react";

const Navbar = () => {
    const { data: session } = useSession();
    const notLoggedIn = !session || !session.user;
    const router = useRouter();
    const { toast } = useToast();

    const logoutHandler = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (err: any) {
            console.error("Logout Error:", err);
            toast({
                title: "Error",
                description: err?.response?.data?.message || err.message || "Unknown error occurred",
                variant: "destructive",
            });
        }
    };

    const addRoomHandler = useCallback(async () => {
        try {
            const response = await fetch("/api/add-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: session?.user?._id?.toString(),
                }),
            });
            const data = await response.json();
            if (data?.roomId) {
                return data.roomId;
            }
            throw new Error("Room ID not found in the response");
        } catch (err: any) {
            console.error("Add Room Error:", err);
            toast({
                title: "Error",
                description: err?.response?.data?.message || err.message || "Unknown error occurred",
                variant: "destructive",
            });
            return "";
        }
    }, [toast, session]);

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-sm bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        href={notLoggedIn ? "/" : "/dashboard"} 
                        className="flex items-center space-x-2 group"
                    >
                        <PenLine className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                        <span className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                            CollabBlogging Hub
                        </span>
                    </Link>
                    
                    {/* Navigation Items */}
                    <div className="flex items-center space-x-4">
                        <Link 
                            href="/blogstore" 
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                        >
                            Store
                        </Link>

                        {!notLoggedIn && (
                            <>
                                <Button
                                    onClick={() => {
                                        addRoomHandler().then((id) => {
                                            if (id) router.push(`/write-blog/${id}`);
                                        });
                                    }}
                                    className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-md transition-colors"
                                >
                                    Write Blog
                                </Button>

                                <Link 
                                    href={`/user/${session.user.username || "profile"}`} 
                                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
                                >
                                    {session.user.username || "Profile"}
                                </Link>

                                <Button 
                                    onClick={logoutHandler}
                                    variant="ghost"
                                    className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors"
                                >
                                    Logout
                                </Button>
                            </>
                        )}

                        {notLoggedIn && (
                            <Link href="/sign-in">
                                <Button className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-md transition-colors">
                                    Login
                                </Button>
                            </Link>
                        )}

                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;