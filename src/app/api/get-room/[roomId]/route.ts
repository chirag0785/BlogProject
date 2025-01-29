import { dbConnect } from "@/lib/dbConnect";
import RoomModel from "@/model/Room";

export async function GET(request:Request,route:{params:{roomId:string}}){
    await dbConnect();
    const {roomId}=route.params;
    try{
        const room=await RoomModel.findOne({_id:roomId});
        if(!room){
            return Response.json({
                success:false,
                message:`Room ${roomId} not found`
            },{status:404});
        }
        return Response.json({
            success:true,
            message:`Room ${roomId} fetched successfully`,
            room
        },{status:200});
    }catch(err:any){
        return Response.json({
            success:false,
            message:err.message
        },{status:500});
    }
}