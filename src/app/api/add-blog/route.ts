import { dbConnect } from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import BlogModel from "@/model/Blog";
import mongoose from "mongoose";
import { assignBatches } from "@/lib/assignBatches";
import { client } from "@/utils/recombee";
import recombee from "recombee-api-client";
export async function POST(request:Request){

    await dbConnect();
    const session=await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not authorized to add a blog , signin first"
        },{status:401})
    }

    
    const {topic,heading,content,wordCount}=await request.json();
    const user:User=session.user as User;

    try{
        const foundUser=await UserModel.findOne({_id:user._id});

        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        const timeToRead=Math.ceil(wordCount/150);
        const newBlog=await BlogModel.create({
            creator:foundUser?.username,
            topic,
            heading,
            content,
            timeToRead:`${timeToRead}m read`,
            name:foundUser.name,
            profileImg:foundUser.profileImg
        });
        (foundUser.blogs).push({blogId:(newBlog._id as mongoose.Types.ObjectId)});

        foundUser.wordCount+=wordCount;
        await foundUser.save();

        await assignBatches(foundUser._id as string);
        
        
        const rqs=recombee.requests;

        let reqs=new rqs.SetItemValues(
            newBlog._id as string,
            {
                topic:newBlog.topic,
                heading:newBlog.heading,
                creator:newBlog.creator,
                content:newBlog.content
            },
            {"cascadeCreate":true});
        reqs.timeout=10000;
        await client.send(reqs);
        return Response.json({
            success:true,
            message:"Blog added success"
        },{status:200})
    }catch(err){
        return Response.json({
            success:false,
            message:"Internal Error while adding blog"
        },{status:500})
    }
}