import { assignBatches } from "@/lib/assignBatches";
import BlogModel from "@/model/Blog";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {blogId}=await request.json();

    if(!blogId){
        return NextResponse.json({
            success: false,
            message: "Missing blogId"
        },{status:400});
    }

    // Delete blog from database
    try{
        const blog = await BlogModel.findOne({_id:blogId});
        if(!blog){
            return NextResponse.json({
                success: false,
                message: "Blog not found"
            },{status:404});
        }
        if(blog.topic=="untitled"){
            return NextResponse.json({
                success: false,
                message: "Cannot publish untitled blog"
            },{status:400});
        }
        
        blog.public = true;
        blog.collaborators=blog.editAccess;
        await blog.save();

        // Add blog to user's public blogs
        const user = await UserModel.findOne({username:blog.creator});
        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            },{status:404});
        }
        user.blogs.push({blogId:blog._id as mongoose.Types.ObjectId});
        user.wordCount+=(blog?.wordCount as number);
        await user.save();
        
        await assignBatches(user._id as string);

        return NextResponse.json({
            success: true,
            message: "Blog published successfully"
        },{status:200});
    }catch(err){
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        },{status:500});
    }
}