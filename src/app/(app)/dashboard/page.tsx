"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import topics from "../../../../topics.json";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Blog } from '@/model/Blog';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FaComment, FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
interface blogIdSet{
  id:string
}
const Page = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [isFetched, setIsFetched] = useState(false);
  const {data:session}=useSession();
  const fetchBlogsByTopic = async (topic: string) => {
    setIsFetched(false);
    
    try {
      const response = await axios.get<ApiResponse>(`/api/get-blogs-by-topic/${topic}`);
      setBlogs(response.data.blogs || []);
      setIsFetched(true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };

  const fetchPersonalizedBlogs = async () => {
    setIsFetched(false);
    try {
      const response = await axios.get("/api/get-blog-recommendations");
      const blogIds=response.data.blogs;

      const {data}=await axios.post('/api/get-blogs-by-ids',{
        blogIds:blogIds as Array<blogIdSet>
      })

      setBlogs(data.blogs || []);
      setIsFetched(true);
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    }
  };
  useEffect(()=>{
    const topic="Self Improvement";
    fetchBlogsByTopic(topic);
  },[]);

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="Self Improvement" className="w-full max-w-6xl mx-auto">
        <TabsList className="flex space-x-6 border-b border-gray-300 mb-6">
          <TabsTrigger key="For you" onClick={() => fetchPersonalizedBlogs()} value="For you" className="px-5 py-3 text-base font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
            For You
          </TabsTrigger>
          {topics.map((topic) => (
            <TabsTrigger
              key={topic}
              value={topic}
              onClick={() => fetchBlogsByTopic(topic)}
              className="px-5 py-3 text-base font-medium text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {topic}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
            key="For you"
            value="For you"
            className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            {!isFetched ? (
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <Skeleton className="h-10 w-1/2 bg-gray-200 rounded-md" />
                  <Skeleton className="h-8 w-3/4 bg-gray-200 rounded-md" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <Skeleton className="h-32 w-full bg-gray-200 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              blogs.length === 0 ? (
                <div className="text-center text-gray-500">No Blogs Found</div>
              ) : (
                blogs.map((blog, indx) => (
                  <div
                    key={indx}
                    className="mb-6 p-4 border-b border-gray-300 last:border-0"
                  >
                    <Card className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => router.push(`/blog/${blog.creator}/${blog._id}`)}>
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
                          {blog.heading}
                        </CardTitle>
                        <CardDescription className="text-gray-600 flex items-center space-x-3">
                          <Image src={blog.profileImg as string} alt={`${blog.name}'s profile`} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                          <span className="text-sm">{blog.name} in {blog.topic}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-4 text-gray-700">
                        <p className="text-sm">{blog.timeToRead}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FaHeart className="text-red-500" />
                            <span>{blog.likes > 0 ? blog.likes : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaComment className="text-blue-500" />
                            <span>{blog.comments?.length > 0 ? blog.comments.length : ''}</span>
                          </div>
                        </div>
                        <p className="text-sm">{new Date(blog.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              )
            )}
          </TabsContent>
        {topics.map((topic) => (
          <TabsContent
            key={topic}
            value={topic}
            className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
          >
            {!isFetched ? (
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <Skeleton className="h-10 w-1/2 bg-gray-200 rounded-md" />
                  <Skeleton className="h-8 w-3/4 bg-gray-200 rounded-md" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <Skeleton className="h-32 w-full bg-gray-200 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              blogs.length === 0 ? (
                <div className="text-center text-gray-500">No Blogs Found</div>
              ) : (
                blogs.map((blog, indx) => (
                  <div
                    key={indx}
                    className="mb-6 p-4 border-b border-gray-300 last:border-0"
                  >
                    <Card className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => router.push(`/blog/${blog.creator}/${blog._id}`)}>
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
                          {blog.heading}
                        </CardTitle>
                        <CardDescription className="text-gray-600 flex items-center space-x-3">
                          <Image src={blog.profileImg as string} alt={`${blog.name}'s profile`} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                          <span className="text-sm">{blog.name} in {blog.topic}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="py-4 text-gray-700">
                        <p className="text-sm">{blog.timeToRead}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FaHeart className="text-red-500" />
                            <span>{blog.likes > 0 ? blog.likes : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaComment className="text-blue-500" />
                            <span>{blog.comments?.length > 0 ? blog.comments.length : ''}</span>
                          </div>
                        </div>
                        <p className="text-sm">{new Date(blog.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              )
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Page;
