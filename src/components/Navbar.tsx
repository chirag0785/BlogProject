"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

const Navbar = () => {
    const { data: session } = useSession();
    
    const notLoggedIn = !session || !session.user;
    const router = useRouter();
    const { toast } = useToast();

    useEffect(()=>{
        
    },[session])
    
    const logoutHandler = async () => {
        try {
            await signOut({callbackUrl:'/'});
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Unknown error occurred",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="bg-gray-900 shadow-lg px-6 py-4 flex justify-between items-center">
            <Link href={notLoggedIn ? '/' : '/dashboard'} className="text-2xl font-bold text-white hover:text-gray-300">
                Blog Creator
            </Link>
            <div className="flex items-center space-x-6">
                {!notLoggedIn && <Link href={'/write-blog'} className="text-gray-300 font-medium">Write Blog</Link>}
                {!notLoggedIn && (
                    <Link href={`/user/${session.user.username}`} className="text-gray-300 font-medium">
                        {session.user.username}
                    </Link>
                )}
                <Link href="/blogstore" className="text-gray-300 font-bold">Store</Link>
                {notLoggedIn ? (
                    <Link href="/sign-in">

                        <Button className="bg-white hover:bg-gray-300 text-black px-4 py-2 rounded-md">
                            Login
                        </Button>
                    </Link>
                ) : (
                    <Button onClick={logoutHandler} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                        Logout
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Navbar;
