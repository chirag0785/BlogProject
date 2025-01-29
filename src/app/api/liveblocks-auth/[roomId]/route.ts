
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getRandomHexColor } from "@/utils/getRandomHexColor";
import { liveblocks } from "@/lib/liveblocks";
import RoomModel from "@/model/Room";
export async function POST(request: NextRequest, { params }: { params: { roomId: string } }) {
    // Ensure the LIVEBLOCKS_SECRET_KEY is set
    if (!process.env.LIVEBLOCKS_SECRET_KEY) {
        return new NextResponse("Missing LIVEBLOCKS_SECRET_KEY", { status: 403 });
    }

    // Get the current user session from NextAuth
    const userSession = await getServerSession(authOptions);

    // Check if user is authorized
    if (!userSession || !userSession.user) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Not authorized to join room",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const room=await liveblocks.getRoom(`blog-room:${params.roomId}`);
    const roomDB=await RoomModel.findById(params.roomId);
    if(!room){
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Room not found",
            }),
            { status: 404, headers: { "Content-Type": "application/json" } }
        );
    }

    if(!roomDB?.accessToAll && Object.keys(room.usersAccesses).findIndex((userId) => userId === userSession.user._id) === -1){
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Not authorized to join room",
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    // Create a session for the current user using Liveblocks
    const session = liveblocks.prepareSession(`user-${userSession.user._id}`, {
        userInfo: {
            name: userSession.user.name || "Anonymous",
            avatar: userSession.user.profileImg || "",
            color: getRandomHexColor(),
        },
    });

    // Use the dynamic room name instead of the hardcoded one
    session.allow(`blog-room:${params.roomId}`, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { status, body } = await session.authorize();

    return new NextResponse(body, { status });
}
