import {z} from "zod";
import { usernameValidation } from "./signUpSchema";

export const setUsernameSchema=z.object({
    username:usernameValidation
})