import { z } from "zod";

export const verifySchema=z.object({
    code:z.string().length(6,{message:"Verification Code must be exactly 6 characters"})
})