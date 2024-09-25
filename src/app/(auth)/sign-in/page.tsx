"use client"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
const page = () => {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await signIn("credentials",{ identifier: data.identifier, password: data.password ,redirect:false});
            
            if(response?.error){
                toast({
                    title: "Error",
                    description: response.error,
                    variant: "destructive",
                });
                return;
            }
            toast({
                title: "Success",
                description: "Sign in success",
            });
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    const signInViaGoogle=async ()=>{
        try{
            const response=await signIn("google",{callbackUrl:'/set-username'});
            
            if(response?.error){
                toast({
                    title: "Error",
                    description: response.error,
                    variant: "destructive",
                });
                return;
            }
        }catch(err:any){
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive",
            });
        }
    }
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-700">
            <div className="max-w-md w-full bg-gray-300 p-8 shadow-lg rounded-lg">
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
                    Welcome to BlogCreator
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Login to your Account to start blogging
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email or username"
                                            {...field}
                                            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your password"
                                            {...field}
                                            type="password"
                                            className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {isSubmitting ? (
                            <Loader2 className="animate-spin mx-auto" />
                        ) : (
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                            >
                                Signin
                            </Button>
                        )}
                    </form>
                </Form>

                <p className="text-center text-gray-600 mt-4">
                    <Button onClick={()=>signInViaGoogle()}>Login with Google</Button>
                </p>
                <p className="text-center text-gray-600 mt-4">
                    New User?{" "}
                    <Link href="/sign-up" className="text-indigo-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

        </div>
    );
}

export default page