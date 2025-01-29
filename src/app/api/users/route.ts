import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getRandomHexColor } from "@/utils/getRandomHexColor";
import { NextRequest, NextResponse } from "next/server";
async function getUser(userId: string) {
  if (!userId.startsWith("user-")) {
    return;
  }

  try{
    const user=await UserModel.findOne({_id:userId.replace("user-","")});
    if(user){
      return {
        name: user.name,
        avatar: user?.profileImg,
        color: getRandomHexColor(),
      };
    }

    return {
      name: "Unknown User",
      avatar: "https://liveblocks.io/avatars/avatar-0.png",
      color: getRandomHexColor(),
    }
  }catch(err){
    return {
      name: "Unknown User",
      avatar: "https://liveblocks.io/avatars/avatar-0.png",
      color: getRandomHexColor(),
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userIds = searchParams.getAll("userIds");
    
  if (!userIds || !Array.isArray(userIds)) {
    return new NextResponse("Missing or invalid userIds", { status: 400 });
  }
  await dbConnect();

  const users = await Promise.all(userIds.map(getUser));

  return NextResponse.json(users);
}