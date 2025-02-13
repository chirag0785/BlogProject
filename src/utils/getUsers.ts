import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function getUsers(){
    await dbConnect();
    try{
        const users=await UserModel.find({}).select("-blogs -password");
        return users;
    }catch(err){
        console.error(err);
        throw new Error("Error while fetching users");
    }
}