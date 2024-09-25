import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import BlogModel from "@/model/Blog";

export async function POST(request:Request){
    await dbConnect();

    const {name,bio}=await request.json();
    const session=await getServerSession(authOptions);

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authorized to edit profile",
        },{status:401});
    }
    try{
        const foundUser=await UserModel.findOne({username:session.user.username?.toLowerCase()});
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        foundUser.name=name;
        foundUser.bio=bio;

        await foundUser.save();
        const blogs=await BlogModel.updateMany({creator:session.user.username?.toLowerCase()},{$set:{name:name}});


        const updatedUser = await UserModel.findOne({ username: session.user?.username?.toLowerCase() })
            .populate({
                path:'blogs.blogId',
                model:BlogModel,
                select:"-content"
            });
        return Response.json({
            success:true,
            message:"Updation to user details success",
            user:updatedUser
        },{status:200})
    }catch(err){
        return Response.json({
            success:false,
            message:"Error while updating details",
        },{status:500})
    }
}