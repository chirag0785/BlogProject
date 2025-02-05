import BlogModel from "@/model/Blog";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {blogId} = await request.json();

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
        await BlogModel.deleteOne({_id:blogId});
        return NextResponse.json({
            success: true,
            message: "Blog deleted successfully"
        },{status:200});    
    }catch(err){
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        },{status:500});
    }
}