import { dbConnect } from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET(request:Request,route:{params:{blogId:string}}){
    await dbConnect();
    const {blogId}=route.params;

    const session=await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"User not authorized, kindly login first"
        },{status:401});
    }
    try{
        const blog=await BlogModel.findOne({_id:blogId});

        if(!blog){
            return Response.json({
                success:false,
                message:`Blog not found with id ${blogId}`
            },{status:404});
        }
        return Response.json({
            success:true,
            message:"Blog fetched successfully",
            blog:blog
        },{status:200});
    }catch(err){
        return Response.json({
            success:false,
            message:`Internal server error while getting blog`
        },{status:500});
    }
}