"use client";
import { FaHeart, FaComment } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/model/User";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CircularProgress from '@mui/joy/CircularProgress';
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { editProfileSchema } from "@/schemas/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { badges, batchNames } from "../../../../../badges";
import { UpcomingBadges } from "@/utils/getUpcomingBadges";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image";
import { Blog } from "@/model/Blog";
const Page = ({ params }: { params: { username: string } }) => {
  const { data: session } = useSession();
  const { username } = params;
  const [isFetched, setIsFetched] = useState(false);
  const [isPrivateBlogsFetched, setIsPrivateBlogsFetched] = useState(false);
  const [user, setUser] = useState<User>({} as User);
  const [upcomingBadges, setUpcomingBadges] = useState<UpcomingBadges>({});
  const [privateBlogs, setPrivateBlogs] = useState<Blog[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      bio: ""
    },
    values: {
      name: user?.name,
      bio: user?.bio
    }
  });
  const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    if (user.bio === data.bio && user.name === data.name) { //no changes done
      toast({
        title: "Success",
        description: "Changes to the profile saved"
      })
      return;
    }
    try {
      const response = await axios.post<ApiResponse>(`/api/edit-profile`, {
        name: data.name,
        bio: data.bio
      })
      setUser(response.data.user as User);
      toast({
        title: "Success",
        description: "Changes to the profile saved"
      })
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive"
      })
    }
  }
  const fetchUserDetails = useCallback(async () => {
    setIsFetched(false);
    try {
      const response = await axios.get<ApiResponse>(`/api/get-user/${username}`);
      setUser(response.data.user as User);
      setUpcomingBadges(response.data.upcomingbadges as UpcomingBadges);
      setIsFetched(true);
      console.log(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  }, [username, session]);

  const fetchPrivateBlogs = useCallback(async () => {
    setIsPrivateBlogsFetched(false);
    try {
      const response = await axios.get(`/api/get-private-blogs/${username}`);
      setPrivateBlogs(response.data.blogs as Blog[]);
      setIsPrivateBlogsFetched(true);
      console.log(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  }, [username, session]);
  useEffect(() => {
    fetchUserDetails();
    fetchPrivateBlogs();
  }, [fetchUserDetails, username, session]);


  const editBlog = (blog: Blog) => {
    axios.post('/api/add-room',{
      id:session?.user._id,
      blog
    })
    .then((response)=>{
      return response.data;
    })
    .then((data)=>{
      router.push(`/edit-blog/${data.roomId}?blogId=${blog._id}`);
    })
    .catch((error)=>{
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Unknown error occurred",
        variant: "destructive",
      });
    })
  }

  const deleteBlog = (blog: Blog) => {
    axios.post('/api/delete-blog',{
      blogId:blog._id
    })
    .then((response)=>{
      return response.data;
    })
    .then((data)=>{
      toast({
        title: "Success",
        description: "Blog deleted successfully",
        duration: 5000,
      });
      fetchPrivateBlogs();
    })
    .catch((error)=>{
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || "Unknown error occurred",
        variant: "destructive",
      });
    })
  }

  const publishBlog = (blog: Blog) => {
    axios.post('/api/publish-blog',{
      blogId:blog._id
    })
    .then((response)=>{
      return response.data;
    })
    .then((data)=>{
      toast({
        title: "Success",
        description: "Blog published successfully",
        duration: 5000,
      });
      
      fetchPrivateBlogs();
      fetchUserDetails();
    })
  }
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full md:w-3/4 p-8 bg-white dark:bg-gray-800 shadow-md">
        {!isFetched ? (
          <div className="w-full space-y-6">
            <Skeleton className="h-12 w-3/4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-24 w-full bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-24 w-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100">{user.name}</h1>
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="flex mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <TabsTrigger value="home" className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm transition-all">Home</TabsTrigger>
                <TabsTrigger value="about" className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 data-[state=active]:shadow-sm transition-all">About</TabsTrigger>
              </TabsList>
              <TabsContent value="home" className="focus:outline-none overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">My Blogs</h2>
                <div className="space-y-4 h-[500px] overflow-y-auto pr-4">
                  {user.blogs.map((blog) => (
                    <Card className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer dark:bg-gray-700 dark:border-gray-600" key={(blog.blogId as any)?._id} onClick={() => router.push(`/blog/${(blog.blogId as any).creator}/${(blog.blogId as any)._id}`)}>
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {(blog.blogId as any)?.heading}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {user.name} in {(blog.blogId as any)?.topic}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-4 text-gray-700 dark:text-gray-200">
                        <p className="mb-2">{(blog.blogId as any)?.timeToRead}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaHeart className="text-red-500" />
                            <span>{(blog.blogId as any)?.likes > 0 ? (blog.blogId as any)?.likes : ''}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaComment className="text-blue-500" />
                            <span>{(blog.blogId as any)?.comments?.length > 0 ? (blog.blogId as any)?.comments.length : ''}</span>
                          </div>
                        </div>
                        <p className="text-sm">{new Date((blog.blogId as any)?.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </CardFooter>
                      <Button 
                        onClick={() => editBlog(blog.blogId as any)} 
                        className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Edit Blog
                      </Button>
                    </Card>
                  ))}
  
                  <div className="text-gray-800 dark:text-gray-200">Private Blogs yet to be published</div>
                  
                  {privateBlogs.map((blog) => (
                    <Card className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer dark:bg-gray-700 dark:border-gray-600" key={blog._id as any}>
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {blog.heading}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-300">
                          {user.name} in {blog.topic}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-4 text-gray-700 dark:text-gray-200">
                        <p className="mb-2">{blog.timeToRead}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <FaHeart className="text-red-500" />
                            <span>{blog.likes > 0 ? blog.likes : ''}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaComment className="text-blue-500" />
                            <span>{blog.comments?.length > 0 ? blog.comments.length : ''}</span>
                          </div>
                        </div>
                        <p className="text-sm">{new Date(blog.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </CardFooter>
                      <Button 
                        onClick={() => editBlog(blog)} 
                        className="p-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Edit Blog
                      </Button>

                      <Button 
                        onClick={() => deleteBlog(blog)} 
                        className="p-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700"
                      >
                        Delete Blog
                      </Button>

                      <Button
                        onClick={() => publishBlog(blog)}
                        className="p-2 bg-green-500 dark:bg-green-600 text-white rounded-lg hover:bg-green-600 dark:hover:bg-green-700"
                        >Publish Blog
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="about" className="focus:outline-none">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">About {user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">{user.bio || "Add Bio to your account"}</p>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
  
      <div className="w-full md:w-1/2 p-8 flex justify-center items-start bg-gray-50 dark:bg-gray-900">
        {!isFetched ? (
          <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            <Skeleton className="h-40 w-40 rounded-full bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8 w-48 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-6 w-32 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-10 w-36 bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 w-full max-w-md">
            <Image src={user.profileImg as string} alt="Profile" width={160} height={160} className="h-40 w-40 rounded-full object-cover shadow-lg" />
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.name}</div>
            <div className="text-lg text-gray-600 dark:text-gray-300">@{user.username}</div>
            {session?.user.username === user.username && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="dark:text-gray-100">Edit profile</DialogTitle>
                    <DialogDescription className="dark:text-gray-300">
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-200">Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="dark:bg-gray-700 dark:text-gray-100" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="dark:text-gray-200">Bio</FormLabel>
                            <FormControl>
                              <Input {...field} className="dark:bg-gray-700 dark:text-gray-100" />
                            </FormControl>
                            <FormMessage className="dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <DialogClose asChild>
                        <Button type="submit" className="dark:bg-blue-600 dark:hover:bg-blue-700">Save Changes</Button>
                      </DialogClose>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
            
            <div className="main-container max-h-screen overflow-y-auto">
              {(user.recentBadgeInCommentsCategory ||
                user.recentBadgeInLikesCategory ||
                user.recentBadgeInWordsCategory) && (
                  <div className="recent-badges-section my-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-h-96">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                      Recently Earned Badges
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {user.recentBadgeInWordsCategory && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="badge-item flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <Image
                                  src={badges[user.recentBadgeInWordsCategory as batchNames]}
                                  alt={user.recentBadgeInWordsCategory}
                                  width={96}
                                  height={80}
                                  className="w-24 h-20 object-contain mb-2"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="dark:bg-gray-700 dark:text-gray-100">
                              <p>{user.recentBadgeInWordsCategory}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {user.recentBadgeInLikesCategory && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="badge-item flex flex-col items-center bg-gradient-to-br from-pink-50 to-red-100 dark:from-pink-900 dark:to-red-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <Image
                                  src={badges[user.recentBadgeInLikesCategory as batchNames]}
                                  alt={user.recentBadgeInLikesCategory}
                                  width={96}
                                  height={80}
                                  className="w-24 h-20 object-contain mb-3"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="dark:bg-gray-700 dark:text-gray-100">
                              <p>{user.recentBadgeInLikesCategory}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {user.recentBadgeInCommentsCategory && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="badge-item flex flex-col items-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <Image
                                  src={badges[user.recentBadgeInCommentsCategory as batchNames]}
                                  alt={user.recentBadgeInCommentsCategory}
                                  width={96}
                                  height={80}
                                  className="w-24 h-20 object-contain mb-3"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="dark:bg-gray-700 dark:text-gray-100">
                              <p>{user.recentBadgeInCommentsCategory}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
              )}
  
              <Drawer>
                <DrawerTrigger>
                  <Button className="bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700">{`-->`}</Button>
                </DrawerTrigger>
                <DrawerContent className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <DrawerHeader>
                  <DrawerTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Badges ({user?.badges?.length})
                  </DrawerTitle>
                </DrawerHeader>

                <div className="space-y-6">
                  {user.badges.map((badge) => (
                    <TooltipProvider key={badge.name}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="badge-item flex flex-col items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105">
                            <Image
                              src={badge.imageUrl as string}
                              alt={badge.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-contain mb-3 rounded-full border border-gray-200 dark:border-gray-600"
                            />
                            <p className="text-center text-lg font-semibold text-gray-800 dark:text-gray-100">
                              {badge.name}
                            </p>
                            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                              {badge.category}
                            </p>
                            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                              {badge.assignedDate.toLocaleString('en-IN', {
                                month: '2-digit',
                                day: '2-digit',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-gray-700 dark:text-gray-100">
                          <p>{badge.name} in {badge.category} category</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                <div className="upcoming-badges-section mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-h-[60vh] overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Upcoming Milestones
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.keys(upcomingBadges).map((category, indx) => (
                      <div key={indx} className="flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CircularProgress
                          size="lg"
                          determinate
                          value={upcomingBadges[category].progress}
                          className="mb-3"
                        >
                          <Image
                            src={badges[upcomingBadges[category].badgeName as batchNames]}
                            alt={upcomingBadges[category].badgeName}
                            className="w-16 h-16 object-contain"
                            width={64}
                            height={64}
                          />
                        </CircularProgress>
                        <p className="text-center text-sm font-medium text-gray-800 dark:text-gray-100 mt-2">
                          {upcomingBadges[category].badgeName}
                        </p>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {upcomingBadges[category].progress}% complete
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline" className="bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </div>
  </div>
);
};
export default Page;