import { cohere } from "@/utils/cohere";

export async function GET(request:Request,route:{params:{topicName:string}}){
    const {topicName}=route.params;
    try{
        const response=await cohere.chat({
            model:'command-r-plus',
            messages:[{role:'user',content:`Generate 10 unique and trendy blog title ideas for the topic ${topicName}, separated by ||. Make sure the suggestions are creative, catchy, and reflect current trends in ${topicName}.`}],
            temperature:0.7,
        },{timeoutInSeconds:10})
        return Response.json({
            success:true,
            message:"Suggested headings fetched success",
            suggestedHeadings:(response.message?.content)?(response.message?.content[0].text):"No headings found",
        },{status:200})
    }catch(err){
        console.error(err);
        return Response.json({
            success:false,
            message:"Internal server error while fetching suggested messages",
        },{status:500})
    }
}