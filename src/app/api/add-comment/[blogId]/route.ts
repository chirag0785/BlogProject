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
        const creatorUser=await UserModel.findOne({username:blog.creator});

        if(!creatorUser){
            return Response.json({
                success:false,
                message:"Creator not found"
            },{status:404})
        }
        blog.comments.push({
            username:session?.user.username || "",
            profileImg:session?.user.profileImg || "",
            message:comment,
            commentedAt:new Date(Date.now())
        })

        creatorUser.comments++;
        await blog.save();
        await creatorUser.save();

        await assignBatches(creatorUser._id as string);
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