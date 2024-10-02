import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import recombee from "recombee-api-client";
import {client} from "@/utils/recombee";
export async function GET(request:Request){
    await dbConnect();

    const session=await getServerSession(authOptions);
    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"User not authorized, kindly login first"
        },{status:401});
    }
    try{
        const reqs=recombee.requests;

        let tempReqs=new reqs.RecommendItemsToUser(session.user._id as string, 5);
        tempReqs.timeout=10000;
        const response=await client.send(tempReqs);
        return Response.json({
            success:true,
            message:"Recommended blogs fetched",
            blogs:response.recomms
        },{status:200});
    }catch(err){
        console.log(err);
        return Response.json({
            success:false,
            message:`Internal server error while getting blog`
        },{status:500});
    }
}