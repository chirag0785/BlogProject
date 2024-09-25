import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import BlogModel from "@/model/Blog";
import UserModel from "@/model/User";
import { assignBatches } from "@/lib/assignBatches";

export async function POST(request:Request,route:{params:{blogId:string}}){
    await dbConnect();
    const {blogId}=route.params;
    const {comment}=await request.json();
    const session=await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authorized to comment"
        },{status:401})
    }
    
    
    const user:User=session.user as User;
    try{
        const blog=await BlogModel.findOne({_id:blogId});
        if(!blog){
            return Response.json({
                success:false,
                message:"Blog not found"
            },{status:404})
        }
        const foundUser=await UserModel.findOne({_id:user._id});

        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        blog.comments.push({
            username:session?.user.username || "",
            profileImg:session?.user.profileImg || "",
            message:comment,
            commentedAt:new Date(Date.now())
        })

        foundUser.comments++;
        await blog.save();
        await foundUser.save();

        await assignBatches(foundUser._id as string);
        return Response.json({
            success:true,
            message:"Comment added success",
        },{status:200})
    }catch(err){
        return Response.json({
            success:false,
            message:"Internal Server error while Comment",
        },{status:500})
    }
}