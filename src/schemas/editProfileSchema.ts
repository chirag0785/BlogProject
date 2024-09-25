import { z } from "zod"
export const editProfileSchema=z.object({
    name:z.string().min(2,{message:"Name must be of atleast 2 characters"}).max(50,{message:"Name must be atmax 50 characters"}),
    bio:z.string().max(150,{message:"Bio can be atmax of 150 characters"})
})