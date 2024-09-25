import { dbConnect } from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
export async function GET(request:Request,route:{params:{topic:string}}){
    await dbConnect();
    const {topic}=route.params;

    try{
        const blogs=await BlogModel.find({topic:topic.toLowerCase()}).select("-content");
        return Response.json({
            success:true,
            message:`Blogs of topic ${topic} fetched success`,
            blogs
        },{status:200});
    }catch(err){
        return Response.json({
            success:false,
            message:`Internal server error while fetching blogs`,
        },{status:500})
    }
}