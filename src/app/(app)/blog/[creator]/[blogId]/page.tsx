"use client"
import { FaHeart, FaComment } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { Blog } from "@/model/Blog";
import { User } from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import parse from "html-react-parser";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useSession } from "next-auth/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { commentSchema } from "@/schemas/commentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { comment } from "@/types/comment";
import Image from "next/image";
import { getBlogs, getBlogsById } from "@/utils/getBlogs";
export async function generateMetadata({ params }: { params: { blogId: string, creator: string } }) {
    try{
        const response=await getBlogsById(params.blogId);
        if(!response){
            return {
                title:"Not found",
                description:"The page you are looking for doesn't exist"
            }
        }
        return {
            openGraph:{
                title:response?.heading,
                description:`${response?.heading} by ${response?.creator}`,
                images:[
                    response?.profileImg
                ]
            }
        }
    }catch(err){
        console.error(err);
        return {
            title:"Not found",
            description:"The page you are looking for doesn't exist"
        }
    }
}

export async function generateStaticParams(){
    try{
        const response=await getBlogs();
        
        if(!Array.isArray(response)){
            throw new Error(`Invalid data received: ${typeof response}  from server`);
        }
        if(response.length==0) return [];
        return response.map((blog)=>{
            return {
                blogId:blog._id,
            }
        })
    }catch(err){
        console.error(err);
        return [];
    }
}
const BlogPage = ({ params }: { params: { blogId: string, creator: string } }) => {
    const blogId = params.blogId;
    const creator = params.creator;
    const { toast } = useToast();
    const [isFetchedBlog, setIsFetchedBlog] = useState(false);
    const [blog, setBlog] = useState<Blog>();
    const [blogCreator, setblogCreator] = useState<User>();
    const [isFetchedCreator, setIsFetchedCreator] = useState(false);
    const { data: session } = useSession();
    const [comment, setComment] = useState('');
    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            comment: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof commentSchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/add-comment/${blogId}`, {
                comment: data.comment
            })
            const newBlog = { ...blog };
            newBlog.comments?.push({
                username: session?.user.username || "",
                profileImg: session?.user.profileImg || "",
                commentedAt: new Date(Date.now()),
                message: data.comment
            });
            setBlog(newBlog as Blog);
            toast({
                title: 'Success',
                description: "Comment added success"
            })
            setComment('');
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    };

    const likesHandler = async () => {
        if (session?.user.username === blog?.creator) {
            toast({
                title: "Error",
                description: "Cannot like own Blog",
                variant: "destructive"
            })
            return;
        }
        try {
            const response = await axios.post<ApiResponse>(`/api/add-like/${blogId}`);
            const newBlog = { ...blog };
            newBlog.likes = response.data.likes;
            setBlog(newBlog as Blog);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        }
    };

    const fetchBlog = useCallback(async () => {
        setIsFetchedBlog(false);
        try {
            const response = await axios.get<ApiResponse>(`/api/get-blog/${blogId}`);
            setBlog(response.data.blog);
            setIsFetchedBlog(true);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            });
        }
    }, [blogId, toast]);

    const fetchCreator = useCallback(async () => {
        setIsFetchedCreator(false);
        try {
            const response = await axios.get<ApiResponse>(`/api/get-user/${creator}`);
            setblogCreator(response.data.user);
            setIsFetchedCreator(true);
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            });
        }
    }, [creator, toast]);

    useEffect(() => {
        fetchBlog();
    }, [blogId, fetchBlog]);

    useEffect(() => {
        fetchCreator();
    }, [creator, fetchCreator]);

    return (
        <div className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg max-w-3xl mx-auto min-h-[80vh] flex flex-col justify-between">
            {
                !isFetchedCreator || !isFetchedBlog ?
                    <div className="flex-grow">
                        <div className="flex items-center space-x-4 mb-6">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-full mb-6" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                    </div>
                    :
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">{blog?.heading}</h1>
                        <div className="flex items-center mb-6">
                            <Image className="h-10 w-10 rounded-full mr-4" src={blogCreator?.profileImg as string} alt={`${blogCreator?.name}'s profile`} width={40} height={40} />
                            <div>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{blogCreator?.name}</p>
                                <p className="text-gray-500 dark:text-gray-400">Published in {blog?.topic} • {blog?.timeToRead}</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">{(blog as Blog)?.createdAt.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                        <div className="prose prose-lg dark:prose-invert mb-6">
                            {parse((blog as Blog)?.content)}
                        </div>
                        <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <div
                                            className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                                            onClick={likesHandler}
                                        >
                                            <FaHeart className="text-red-500 text-xl" />
                                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                                {(blog as Blog)?.likes > 0 ? (blog as Blog)?.likes : '0'}
                                            </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-md shadow-lg"
                                    >
                                        {session?.user.username === blog?.creator ? (
                                            <div className="text-xs font-medium">Creator cannot hit the like</div>
                                        ) : (
                                            <div className="text-xs font-medium">Like</div>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <FaComment className="text-blue-500" />
                                        <span>{(blog as Blog)?.comments?.length > 0 ? (blog as Blog)?.comments?.length : '0'}</span>
                                    </div>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full md:w-2/3 lg:w-1/2 overflow-scroll">
                                    <SheetHeader>
                                        <SheetTitle className="text-xl font-semibold">Responses ({(blog as Blog)?.comments.length})</SheetTitle>
                                        <SheetDescription>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="comment"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="flex items-center space-x-4">
                                                                    <Image className="h-8 w-8 rounded-full" src={session?.user.profileImg as string} alt={`${session?.user.name}'s profile`} width={32} height={32} />
                                                                    <span>{session?.user.name}</span>
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder="What are your thoughts?"
                                                                        className="resize-none mt-2 dark:bg-gray-800 dark:text-gray-300"
                                                                        {...field}
                                                                        value={comment}
                                                                        onChange={(ev) => {
                                                                            setComment(ev.target.value);
                                                                            field.onChange(ev.target.value);
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                                                        Submit
                                                    </Button>
                                                </form>
                                            </Form>
                                        </SheetDescription>
                                    </SheetHeader>

                                    {blog?.comments?.map((comment, index) => (
                                        <Card key={index} className="my-4 dark:bg-gray-800 dark:text-gray-300">
                                            <CardHeader className="flex items-center space-x-4">
                                                <Image className="h-8 w-8 rounded-full" src={comment.profileImg as string} alt={`${comment.username}'s profile`} width={32} height={32} />
                                                <div>
                                                    <CardTitle className="text-lg font-semibold">{comment.username}</CardTitle>
                                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{comment.commentedAt.toLocaleString()}</CardDescription>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p>{comment.message}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </SheetContent>
                            </Sheet>
                        </div>
                        <hr className="my-6 border-gray-300 dark:border-gray-600" />
                        <div className="flex items-center">
                            <Image className="h-10 w-10 rounded-full mr-4" src={blogCreator?.profileImg as string} alt={`${blogCreator?.name}'s profile`} width={40} height={40} />
                            <div>
                                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Written by {blogCreator?.name}</p>
                                <p className="text-gray-500 dark:text-gray-400">Editor for {blog?.topic}</p>
                            </div>
                        </div>
                        {blog?.collaborators && blog?.collaborators.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold">Collaborators</h2>
                                <div className="flex gap-4 mt-2">
                                    {blog.collaborators.map((collab, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <Image src={(collab as any)?.profileImg} alt={`${(collab as any)?.name}'s profile}`} width={40} height={40} />
                                            <span className="text-gray-700">{(collab as any).name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
            }
        </div>
    )
}
export default BlogPage;
