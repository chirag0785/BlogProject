import { dbConnect } from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import recombee from "recombee-api-client";
import {client} from "@/utils/recombee";
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
        const blog=await BlogModel.findOne({_id:blogId}).populate('collaborators','name profileImg');

        if(!blog){
            return Response.json({
                success:false,
                message:`Blog not found with id ${blogId}`
            },{status:404});
        }
        const reqs=recombee.requests;

        let tempReqs=new reqs.AddDetailView(session.user._id as string,blogId,{
            'timestamp':new Date().toISOString(),
            'cascadeCreate':true,
        });

        tempReqs.timeout=10000;
        await client.send(tempReqs);

        console.log(blog);
        
        return Response.json({
            success:true,
            message:"Blog fetched successfully",
            blog:blog
        },{status:200});
    }catch(err){
        console.log(err);
        return Response.json({
            success:false,
            message:`Internal server error while getting blog`
        },{status:500});
    }
}