import { dbConnect } from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
interface blogIdSet{
    id:string
  }
export async function POST(request:Request){
    await dbConnect();
    const {blogIds}=await request.json();
    try{
        const blogs=blogIds.map(async (blogId:any)=>{
            const blog=await BlogModel.findOne({_id:blogId.id});

            if(!blog){
                return Response.json({
                    success:false,
                    message:"Blog not found"
                },{status:404})
            }
            return blog;
        })

        return Response.json({
            success:true,
            message:"Blogs fetched",
            blogs:await Promise.all(blogs)
        },{status:200})

    }catch(err){
        return Response.json({
            success:false,
            message:"Internal server error while fetching blogs"
        },{status:500})
    }
}