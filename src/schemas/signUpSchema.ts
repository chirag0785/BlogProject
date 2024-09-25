
import {z} from "zod";
const MAX_FILE_SIZE = 5000000;
function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop() || "";
        if (["jpeg", "png", "jpg","webp"].includes(fileType)) return true; 
    }
    return false;
}
export const usernameValidation=z
                    .string()
                    .min(2,{message:"Username must atleast 2 characters"})
                    .max(20,{message:"Username can be of atmax 20 characters"})
                    .regex(/^[a-zA-Z0-9_]*$/,{message:"Username should not contain special characters"})
export const imageValidation=z
                    .custom<File>((file)=> file instanceof File,{message:"Image is required"})
                    .refine((file: File) => file instanceof File, {message:"File is required"})
                    .refine((file) => file.size < MAX_FILE_SIZE, {message:"Max size is 5MB."})
                    .refine((file) => checkFileType(file), {message:"Only .jpg, .gif, .png formats are supported."})
export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Email Address not valid"}),
    password:z.string().min(6,{message:"Password must be atleast 6 characters"}),
    name:z.string().min(2,{message:"Name must be of atleast 2 characters"}).max(50,{message:"Name must be atmax 50 characters"}),
    image:imageValidation
})