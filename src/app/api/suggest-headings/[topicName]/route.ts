import { cohere } from "@/utils/cohere";

export async function GET(request:Request,route:{params:{topicName:string}}){
    const {topicName}=route.params;
    try{
        const response=await cohere.chat({
            message:`Generate 10 unique and trendy blog title ideas for the topic ${topicName}, separated by ||. Make sure the suggestions are creative, catchy, and reflect current trends in ${topicName}.`,
            connectors:[{id:'web-search'}]
        })
        return Response.json({
            success:true,
            message:"Suggested headings fetched success",
            suggestedHeadings:response.text
        },{status:200})
    }catch(err){
        return Response.json({
            success:false,
            message:"Internal server error while fetching suggested messages",
        },{status:500})
    }
}