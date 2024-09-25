import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request:Request){
    await dbConnect();
    const url=new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    const username=searchParams.get('username');
    try{
        const foundUser=await UserModel.findOne({username:username?.toLowerCase()});

        if(foundUser?.isVerified){
            return Response.json({
                success:false,
                message:"User already exists with the username"
            },{status:401});
        }

        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200});
    }catch(err){
        return Response.json({
            success:false,
            message:"Error while checking username unique"
        },{status:500})
    }
}