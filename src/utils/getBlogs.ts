import { dbConnect } from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";

export async function getBlogs() {
    await dbConnect();
    try{
        const blogs=await BlogModel.find({}).select("-content");
        return blogs;
    }catch(err){
        console.log(err);
        throw new Error("Internal server error while fetching blogs");
    }
}
export async function getBlogsById(id:string) {
    await dbConnect();
    try{
        const blog=await BlogModel.findOne({_id:id}).select("-content");
        return blog;
    }catch(err){
        console.log(err);
        throw new Error("Internal server error while fetching blog");
    }
}