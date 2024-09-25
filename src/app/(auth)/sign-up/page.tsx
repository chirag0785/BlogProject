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
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";

const Page = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState("");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-700">
      <div className="max-w-md w-full bg-gray-300 p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Welcome to BlogCreator
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Start your journey by creating your account.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(ev) => {
                        field.onChange(ev.target.value);
                        debounced(ev.target.value);
                      }}
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    />
                  </FormControl>
                  {isCheckLoading ? (
                    <Loader2 className="animate-spin mt-1" />
                  ) : (
                    <div className="text-sm text-gray-500 mt-1">
                      {usernameMsg}
                    </div>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
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
                Signup
              </Button>
            )}
          </form>
        </Form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
