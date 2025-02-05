"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useCallback } from "react";
import axios from "axios";
import { ThemeToggle } from "./ThemeToggle";

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
            const response = await axios.post("/api/add-room", {
                id: session?.user?._id?.toString(),
            });
            if (response.data?.roomId) {
                return response.data.roomId;
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
        <div className="bg-gray-900 shadow-lg px-6 py-4 flex justify-between items-center">
            <Link href={notLoggedIn ? "/" : "/dashboard"} className="text-2xl font-bold text-white hover:text-gray-300">
                Blog Creator
            </Link>
            
            <div className="flex items-center space-x-6">
                <ThemeToggle/>
                {!notLoggedIn && (
                    <Button
                        onClick={() => {
                            addRoomHandler().then((id) => {
                                if (id) router.push(`/write-blog/${id}`);
                            });
                        }}
                        className="text-gray-300 font-large font-semibold"
                    >
                        Write Blog
                    </Button>
                )}
                {!notLoggedIn && (
                    <Link href={`/user/${session.user.username || "profile"}`} className="text-gray-300 font-medium">
                        {session.user.username || "Profile"}
                    </Link>
                )}
                <Link href="/blogstore" className="text-gray-300 font-bold">
                    Store
                </Link>
                {notLoggedIn ? (
                    <Link href="/sign-in">
                        <Button className="bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-md">Login</Button>
                    </Link>
                ) : (
                    <Button onClick={logoutHandler} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                        Logout
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
