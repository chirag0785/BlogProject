"use client"
import { useToast } from '@/components/ui/use-toast';
import { Blog } from '@/model/Blog';
import { TextEditor } from '@/app/(room)/Editor'
import { Room } from '@/app/(room)/Room'
import ShareOptions from '@/components/ShareOptions'
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import topics from "../../../../../topics.json";
const Page = ({ params ,searchParams}: { params: { roomId: string },searchParams:{blogId?: string}}) => {
  const { blogId } = searchParams;
    const [isOpen, setIsOpen] = useState(false)
    const [blog,setBlog]=useState<Blog>();
    const {toast}=useToast();
    const [error, setError] = useState('');
    const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)
  const [suggestedHeadings, setSuggestedHeadings] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [loading, setLoading] = useState(true);
    const formSchema = z.object({
        topic: z.string().min(2, { message: "Topic must be atleast 2 characters" }),
        heading: z.string().min(2, { message: "Heading must be atleast 2 characters" }),
      })
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          topic: '',
          heading: ''
        }
      });
        const { watch, setValue } = form;
        const topicName = watch("topic");
        const suggestMessagesHandler = async () => {
            if (!topicName) {
              setSuggestedHeadings(["First Choose a topic"]);
              return;
            }
        
            setIsSuggesting(true);
            try {
              const response = await axios.get<ApiResponse>(`/api/suggest-headings/${topicName}`);
              const suggestedHeadingsData = response.data?.suggestedHeadings;
              const delimiters = ['||', '\n'];
              let headings: string[] | undefined = [];
              delimiters.some(delimiter => {
                if (suggestedHeadingsData?.includes(delimiter)) {
                  headings = suggestedHeadingsData.split(delimiter);
                  return true;
                }
                return false;
              });
        
              if (headings.length === 0) {
                headings = suggestedHeadingsData?.split('||');
              }
        
              headings = headings?.map(heading => heading.trim()).filter(heading => heading.length > 0);
        
              setSuggestedHeadings(headings || []);
            } catch (err) {
              const axiosError = err as AxiosError<ApiResponse>;
              toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
              });
            } finally {
              setIsSuggesting(false);
            }
          }
          const onSubmit = async (data: z.infer<typeof formSchema>) => {
            try {
              await axios.post(`/api/update-topic-heading/${params.roomId}`, {
                topic: data.topic,
                heading: data.heading
              })
            } catch (err) {
              const axiosError = err as AxiosError<ApiResponse>;
              toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
              });
            }
          }
    useEffect(()=>{
        if(blogId){
            axios.get(`/api/get-blog/${blogId}`)
            .then((response)=> response.data)
            .then((data)=>{
                setBlog(data.blog);
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

        if (params.roomId) {
            const fetchRoom = async () => {
              try {
                const response = await axios.get(`/api/get-room/${params.roomId}`);
                const room = response.data.room;
                setValue("topic", room.topic);
                setValue("heading", room.heading);
      
              } catch (err) {
                const axiosError = err as AxiosError<ApiResponse>;
                toast({
                  title: "Error",
                  description: axiosError.response?.data.message,
                  variant: "destructive"
                });
                setError(axiosError?.response?.data.message as string);
              } finally {
                setLoading(false);
              }
            }
            fetchRoom();
        }
            
    },[params.roomId,blogId]);

    if(!blog){
        return (
            <div>
                Loading...
            </div>
        )
    }
    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )
      }
      if (error && error.length > 0) {
        return (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-semibold text-gray-800">{error}</h1>
            </div>
          </div>
        )
      }
  return (
    <>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
                <Select onValueChange={(ev)=> field.onChange(ev)} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full border-gray-300 rounded-md">
                      <SelectValue placeholder="Select a Topic for the blog" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="heading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heading</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the heading"
                    className="border-gray-300 rounded-md shadow-sm"
                    {...field}
                    onChange={(ev) => field.onChange(ev.target.value)}
                  />
                </FormControl>
                <div className="flex items-center mt-2">
                  {isSuggesting ? (
                    <Loader2 className="animate-spin text-blue-600 h-6 w-6" />
                  ) : (
                    <button
                      type="button"
                      onClick={suggestMessagesHandler}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Suggest Headings
                    </button>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {suggestedHeadings.map((heading, idx) => (
                    <div
                      onClick={() => setValue("heading", heading.slice(3))}
                      key={idx}
                      className="text-sm text-gray-800 bg-gray-50 border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer"
                    >
                      {heading}
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
            Update Topic and Heading
          </Button>
        </form>
      </Form>

      <Room roomId={params.roomId}>
        <div className="space-y-6 p-6 bg-gray-50 min-h-screen w-full">
          <div className="flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  type='button'
                  className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out"
                  onClick={() => openModal()}
                >
                  Share
                </Button>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>

          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-8 max-w-lg w-full mx-auto rounded-lg shadow-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Share Options</h3>
                  <Button
                    onClick={closeModal}
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    Close
                  </Button>
                </div>
                <ShareOptions roomId={params.roomId} />
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm text-gray-700 border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <TextEditor initialContent={blog?.content}/>
        </div>
      </Room>
    </>
  )
}

export default Page