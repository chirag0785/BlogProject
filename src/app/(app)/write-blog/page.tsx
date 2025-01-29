// "use client"
// import BlogEditor from "@/components/BlogEditor";
// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
// import { blogSchema } from "@/schemas/blogSchema";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { AxiosError } from "axios";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import * as z from "zod";
// import topics from "../../../../topics.json";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Loader2 } from "lucide-react";

// const Page = () => {
//     const [wordCount, setWordCount] = useState(4);
//     const { toast } = useToast();
//     const router = useRouter();
//     const [contentMsg, setContentMsg] = useState('');
//     const [isSuggesting, setIsSuggesting] = useState(false);
//     const form = useForm<z.infer<typeof blogSchema>>({
//         resolver: zodResolver(blogSchema),
//         defaultValues: {
//             content: '<p>Welcome to Blog Editor!</p>',
//             topic: '',
//             heading: ''
//         }
//     });
//     const { watch,setValue } = form;
//     const topicName = watch("topic");
//     const [suggestedHeadings, setSuggestedHeadings] = useState<string[]>([]);

//     const onSubmit = async (data: z.infer<typeof blogSchema>) => {
//         setContentMsg('');
//         if (wordCount < 200) {
//             setContentMsg("Content must be at least 200 words");
//             return;
//         }
//         if (wordCount > 2000) {
//             setContentMsg("Content must be at most 2000 words");
//             return;
//         }
//         try {
//             await axios.post<ApiResponse>('/api/add-blog', {
//                 content: data.content,
//                 topic: data.topic,
//                 heading: data.heading,
//                 wordCount
//             });

//             toast({
//                 title: "Success",
//                 description: "Blog added successfully"
//             });

//             router.push('/dashboard');
//         } catch (err) {
//             const axiosError = err as AxiosError<ApiResponse>;
//             toast({
//                 title: "Error",
//                 description: axiosError.response?.data.message,
//                 variant: "destructive"
//             });
//         }
//     }

//     const suggestMessagesHandler = async () => {
//         if (!topicName) {
//             setSuggestedHeadings(["First Choose a topic"]);
//             return;
//         }

//         setIsSuggesting(true);
//         try {
//             const response = await axios.get<ApiResponse>(`/api/suggest-headings/${topicName}`);
//             const suggestedHeadingsData = response.data?.suggestedHeadings;
//             const delimiters = ['||', '\n'];
//             let headings: string[] | undefined = [];
//             delimiters.some(delimiter => {
//                 if (suggestedHeadingsData?.includes(delimiter)) {
//                     headings = suggestedHeadingsData.split(delimiter);
//                     return true; 
//                 }
//                 return false;
//             });

//             if (headings.length === 0) {
//                 headings = suggestedHeadingsData?.split('||');
//             }

//             headings = headings?.map(heading => heading.trim()).filter(heading => heading.length > 0);

//             setSuggestedHeadings(headings || []);
//         } catch (err) {
//             const axiosError = err as AxiosError<ApiResponse>;
//             toast({
//                 title: "Error",
//                 description: axiosError.response?.data.message,
//                 variant: "destructive"
//             });
//         } finally {
//             setIsSuggesting(false);
//         }
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//             <div className="w-full max-w-4xl bg-white p-10 rounded-lg shadow-lg">
//                 <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add a New Blog</h1>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                         <FormField
//                             control={form.control}
//                             name="topic"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Topic</FormLabel>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger className="w-full border-gray-300">
//                                                 <SelectValue placeholder="Select a Topic for the blog" />
//                                             </SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {topics.map((topic) => <SelectItem key={topic} value={topic}>{topic}</SelectItem>)}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="heading"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-600">Heading</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="Enter the heading"
//                                             className="border-gray-300 rounded-md shadow-sm"
//                                             {...field}

//                                             onChange={(ev)=> field.onChange(ev.target.value)}
//                                         />
//                                     </FormControl>
//                                     <div className="flex items-center mt-2">
//                                         {isSuggesting ? (
//                                             <Loader2 className="animate-spin text-blue-600 h-6 w-6" />
//                                         ) : (
//                                             <button
//                                                 type="button"
//                                                 onClick={suggestMessagesHandler}
//                                                 className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
//                                             >
//                                                 Suggest Headings
//                                             </button>
//                                         )}
//                                     </div>

//                                     <div className="mt-4 space-y-2">
//                                         {suggestedHeadings.map((heading, idx) => (
//                                             <div onClick={()=> setValue("heading",heading.slice(3))} key={idx} className="text-sm text-gray-800 bg-gray-50 border border-gray-200 p-3 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150 ease-in-out cursor-pointer">
//                                                 {heading}
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <FormField
//                             control={form.control}
//                             name="content"
//                             render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel className="text-gray-600">Content</FormLabel>
//                                     <FormControl>
//                                         <Controller
//                                             control={form.control}
//                                             name="content"
//                                             render={({ field: { onChange, value } }) => (
//                                                 <BlogEditor
//                                                     setWordCount={setWordCount}
//                                                     onChange={onChange}
//                                                     value={value}
//                                                 />
//                                             )}
//                                         />
//                                     </FormControl>
//                                     <div className="text-sm text-red-500 mt-1">{contentMsg}</div>
//                                     <FormMessage />
//                                 </FormItem>
//                             )}
//                         />
//                         <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-md py-2">
//                             Submit Blog
//                         </Button>
//                     </form>
//                 </Form>
//             </div>
//         </div>
//     );
// };

// export default Page;
"use client"
import { Room } from "../../(room)/Room";
import { TextEditor } from "../../(room)/Editor";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import { generateHTML,generateJSON } from "@tiptap/html";
export default function Page() {
  const editor = new Editor({
    content: '<paragraph textAlign=\"left\">hel hello hello</paragraph><image alt=\"Backgrounds\" src=\"https://imgs.search.brave.com/PjE33tVn9FgNIvLyiXIda3Iuc-QnbB3f_cexAHHWsHU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/YS1kcm9wLW9mLXBp/bmstYW5kLXllbGxv/dy1wYWludC1pbi13/YXRlci5qcGc_d2lk/dGg9MTAwMCZmb3Jt/YXQ9cGpwZyZleGlm/PTAmaXB0Yz0w\"></image>',
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      ListItem,
      BulletList,
      OrderedList,
      Blockquote,
      Code,
      CodeBlock,
      Highlight,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      Underline,
    ],
  })
  const json=generateJSON('<paragraph textAlign=\"left\">hel hello hello</paragraph><image alt=\"Backgrounds\" src=\"https://imgs.search.brave.com/PjE33tVn9FgNIvLyiXIda3Iuc-QnbB3f_cexAHHWsHU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9idXJz/dC5zaG9waWZ5Y2Ru/LmNvbS9waG90b3Mv/YS1kcm9wLW9mLXBp/bmstYW5kLXllbGxv/dy1wYWludC1pbi13/YXRlci5qcGc_d2lk/dGg9MTAwMCZmb3Jt/YXQ9cGpwZyZleGlm/PTAmaXB0Yz0w\"></image>',[
    Document,
    Paragraph,
    Text,
    Bold,
    // other extensions …
  ])
  const jsonData = JSON.parse();
const html = generateHTML(jsonData, [StarterKit, Image]);

console.log(html);

  return (
    <Room>
      <TextEditor />
    </Room>
  );
}

