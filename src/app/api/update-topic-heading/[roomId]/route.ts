import { dbConnect } from "@/lib/dbConnect";
import RoomModel from "@/model/Room";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    await dbConnect();
    const { roomId } = params;
    const { topic,heading } = await request.json();
    
    try{
        const room=await RoomModel.findOne({ _id: roomId });
        if (!room) {
            return NextResponse.json({
                success: false,
                message: "Room not found",
            }, { status: 404 });
        }
        room.topic=topic;
        room.heading=heading;
        await room.save();
        return NextResponse.json({
            success: true,
            message: "Room updated successfully",
        }, { status: 200 });
    }catch(err){
        console.error(err);
        return NextResponse.json({
            success: false,
            message: "Error updating room",
        }, { status: 500 });
    }
}