import { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
    const baseUrl='https://collab-blogging-hub.vercel.app';
    return {
        rules:{
            userAgent:"*",
            allow:["/","/blog/*","/user/*",],
            disallow:[]
        },
        sitemap:`${baseUrl}/sitemap.xml`   
    }
}