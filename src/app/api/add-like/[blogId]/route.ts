import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import BlogModel from "@/model/Blog";
import UserModel from "@/model/User";
import { assignBatches } from "@/lib/assignBatches";
import recombee from "recombee-api-client";
import { client } from "@/utils/recombee";
export async function POST(request:Request,route:{params:{blogId:string}}){
    await dbConnect();
    const {blogId}=route.params;
    const session=await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authorized to like"
        },{status:401})
    }
    
    const user:User=session?.user as User;
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
        blog.likes++;

        creatorUser.likes++;
        await blog.save();
        await creatorUser.save();


        await assignBatches(creatorUser._id as string);

        const reqs=recombee.requests;
        let tempReqs=new reqs.AddRating(user._id as string,blogId,1,{
            'timestamp':new Date().toISOString()
        });

        tempReqs.timeout=10000;
        await client.send(tempReqs);
        return Response.json({
            success:true,
            message:"Like added success",
            likes:blog.likes
        },{status:200})
    }catch(err){
        return Response.json({
            success:false,
            message:"Internal Server error while Like",
        },{status:500})
    }
}