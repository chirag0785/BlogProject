"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";

const Page = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      name: "",
      image: undefined as unknown as File,
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await axios.post("/api/sign-up", formData);
      toast({
        title: "Success",
        description: "Sign Up Success, verify code sent to the email",
      });
      router.replace(`/verify/${data.username}`);
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
  };

  const checkUsernameUnique = useCallback(async () => {
    setIsCheckLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `/api/check-username-unique?username=${username}`
      );
      setUsernameMsg(response.data.message);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      setUsernameMsg(
        axiosError.response?.data.message || "Internal Server error"
      );
    } finally {
      setIsCheckLoading(false);
    }
  }, [username, debounced, setUsername]);

  useEffect(() => {
    setUsernameMsg("");
    if (username) {
      checkUsernameUnique();
    }
  }, [checkUsernameUnique, username]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700 dark:bg-gray-900 py-8">
      <div className="max-w-md w-full bg-gray-300 dark:bg-gray-800 p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
          Welcome to BlogCreator
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Start your journey by creating your account.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-gray-200">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(ev) => {
                        field.onChange(ev.target.value);
                        debounced(ev.target.value);
                      }}
                      className="border-gray-300 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:text-white"
                    />
                  </FormControl>
                  {isCheckLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mt-1 text-gray-500" />
                  ) : (
                    usernameMsg && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {usernameMsg}
                      </div>
                    )
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-gray-200">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="border-gray-300 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:text-white"
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
                  <FormLabel className="text-black dark:text-gray-200">
                    Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10 border-gray-300 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-gray-200">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                      className="border-gray-300 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-black dark:text-gray-200">
                    Profile Image
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                      className="border-gray-300 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 rounded-md dark:text-white cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md dark:bg-indigo-700 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;