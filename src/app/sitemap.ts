import { getBlogs } from "@/utils/getBlogs"
import { getUsers } from "@/utils/getUsers";
export default async function sitemap(){
    const baseUrl='https://collab-blogging-hub.vercel.app';
    const response=await getBlogs();
    const response2=await getUsers();
    const blogs=response.map((blog)=>{
        return {
            url:`${baseUrl}/blog/${blog?.creator}/${blog?._id}`,
            lastModified:blog?.createdAt
        }
    })
    const users=response2.map((user)=>{
        return {
            url:`${baseUrl}/user/${user?.username}`,
            lastModified:new Date()
        }
    })
    return [
        {
            url:'https://collab-blogging-hub.vercel.app',
            lastModified:new Date(),
        },
        {
            url:'https://collab-blogging-hub.vercel.app/dashboard',
            lastModified:new Date(),
        },
        ...blogs,
        ...users
    ]
}