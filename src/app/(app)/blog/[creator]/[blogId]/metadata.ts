import { getBlogs, getBlogsById } from "@/utils/getBlogs";
export async function generateMetadata({ params }: { params: { blogId: string, creator: string } }) {
    try{
        const response=await getBlogsById(params.blogId);
        if(!response){
            return {
                title:"Not found",
                description:"The page you are looking for doesn't exist"
            }
        }
        return {
            openGraph:{
                title:response?.heading,
                description:`${response?.heading} by ${response?.creator}`,
                images:[
                    response?.profileImg
                ]
            }
        }
    }catch(err){
        console.error(err);
        return {
            title:"Not found",
            description:"The page you are looking for doesn't exist"
        }
    }
}

export async function generateStaticParams(){
    try{
        const response=await getBlogs();
        
        if(!Array.isArray(response)){
            throw new Error(`Invalid data received: ${typeof response}  from server`);
        }
        if(response.length==0) return [];
        return response.map((blog)=>{
            return {
                blogId:blog._id,
            }
        })
    }catch(err){
        console.error(err);
        return [];
    }
}