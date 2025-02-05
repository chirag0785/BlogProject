"use client"
import { getSession, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import * as z from "zod";
import { setUsernameSchema } from "@/schemas/setUsernameSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounceCallback } from "usehooks-ts"
import { useCallback, useEffect, useState } from "react"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
const Page = () => {
    const { data: session, update } = useSession();
    const [username, setUsername] = useState("");
    const [usernameMsg, setUsernameMsg] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500);
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof setUsernameSchema>>({
        resolver: zodResolver(setUsernameSchema),
        defaultValues: {
            username: ""
        }
    })

    const checkUsernameUnique = useCallback(async () => {
        setIsCheckingUsername(true);
        setUsernameMsg('');
        try {
            const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${username}`);

            setUsernameMsg(response.data.message);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            setUsernameMsg(axiosError.response?.data.message || "");
        } finally {
            setIsCheckingUsername(false);
        }
    }, [username]);

    useEffect(() => {
        if (session && session.user && session?.user.username != '#') {   //already set the username
            router.push('/dashboard');
            return;
        }
    }, [session]);
    useEffect(() => {
        if (username) {
            checkUsernameUnique();
        }
    }, [username, checkUsernameUnique, session])
    const onSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/set-username-after-google-login', {
                username,
                email: session?.user?.email
            })

            const updatedSession = await update({
                user: {
                    username: username
                }
            });


            await getSession();
            toast({
                title: "Success",
                description: "Username Set Success",
            })
            window.location.reload();
            router.replace('/dashboard');
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-700 dark:bg-gray-900">
            <div className="w-full max-w-lg p-8 bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
                    Welcome to BlogCreator
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Set Your Username And Start Blogging
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black dark:text-gray-200">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter username"
                                            {...field}
                                            onChange={(ev) => {
                                                debounced(ev.target.value);
                                                field.onChange(ev.target.value);
                                            }}
                                            className="dark:bg-gray-900 dark:text-white dark:border-gray-700"
                                        />
                                    </FormControl>
                                    {isCheckingUsername ? (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-400 dark:text-gray-500">Checking...</span>
                                        </div>
                                    ) : (
                                        <p className="text-red-500 dark:text-red-400 mt-2">{usernameMsg}</p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            {isSubmitting ? (
                                <Loader2 className="animate-spin text-gray-500 dark:text-gray-400" />
                            ) : (
                                <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Submit
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>
        </div>

    )
}

export default Page