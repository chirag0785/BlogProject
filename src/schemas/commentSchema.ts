import {z} from "zod";

export const commentSchema=z.object({
    comment:z
            .string()
            .min(2,{message:"comment must be atleast 2 characters"})
            .max(100,{message:"comment can be of atmax 100 characters long"})
})