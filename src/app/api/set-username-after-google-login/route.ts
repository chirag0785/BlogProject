import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request:Request){
    await dbConnect();

    try{
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }
        const {username,email}=await request.json();

        const user=await UserModel.findOne({email});
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        user.username=username;
        await user.save();
        
        if(session.user){
            session.user.username=username;
        }
        return  Response.json({
            success:true,
            message:"Username set success"
        },{status:200})
    }catch(err){
        return Response.json({
            success:false,
            message:"Internal server error while setting username"
        },{status:500})
    }
}