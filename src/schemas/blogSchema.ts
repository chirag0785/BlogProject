import { z } from "zod";
export const blogSchema=z.object({
    topic:z.string().min(2,{message:"Topic must be atleast 2 characters"}),
    heading:z.string().min(2,{message:"Heading must be atleast 2 characters"}),
    content:z.string()
})