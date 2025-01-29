import { dbConnect } from "@/lib/dbConnect";
import { liveblocks } from "@/lib/liveblocks";
import RoomModel from "@/model/Room";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, route: { params: { roomId: string } }) {
    await dbConnect();
    const { emails, shareOption } = await request.json();
    const { roomId } = route.params;
    console.log(emails);
    
    if (!roomId) {
        return NextResponse.json({
            success: false,
            message: "Missing roomId",
        }, { status: 400 });
    }

    if (!['anyone', 'specific'].includes(shareOption)) {
        return NextResponse.json({
            success: false,
            message: "Invalid share option",
        }, { status: 400 });
    }

    if (!Array.isArray(emails) || emails.some((email) => typeof email !== 'string')) {
        return NextResponse.json({
            success: false,
            message: "Invalid emails format",
        }, { status: 400 });
    }

    try {
        const room = await RoomModel.findOne({ _id: roomId });
        const liveblocksroom = await liveblocks.getRoom(`blog-room:${roomId}`);

        if (!room || !liveblocksroom) {
            return NextResponse.json({
                success: false,
                message: "Room not found",
            }, { status: 404 });
        }

        if (shareOption === 'anyone') {
            room.accessToAll = true;
            await room.save();
        }

        const userIds: { [key: string]: any } = {};
        let users=[];
        if (shareOption === 'specific') {
            room.accessToAll = false;
        
            for (const email of emails) {
                const user = await UserModel.findOne({ email });
                if (user) {
                    userIds[user._id as string] = ['room:write'];
                }
            }
            console.log(Object.keys(userIds).map((id) => new mongoose.Types.ObjectId(id)));
            
            room.editAccess = [...room.editAccess, ...Object.keys(userIds).map((id) => new mongoose.Types.ObjectId(id))]; ;
        }
        
        await room.save();

        const updatedRoom = await liveblocks.updateRoom(`blog-room:${roomId}`, {
            defaultAccesses: [],
            usersAccesses: {
                ...liveblocksroom.usersAccesses,
                ...userIds
            },
        });

        return NextResponse.json({
            success: true,
            message: "Access updated successfully",
            updatedAccess: {
                accessToAll: room.accessToAll,
                editAccess: room.editAccess,
            },
        }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            success: false,
            message: "Internal server error",
        }, { status: 500 });
    }
}
