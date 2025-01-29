import { NextRequest, NextResponse } from "next/server";
import UserModel, { User } from "@/model/User";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get("text");

  const users= await UserModel.find({});
  const liveblockUsers = users.map(
    (user:User,userIndex:number) =>
      ({ id: `user-${user._id}`, name:user.name })
  );
  const filteredUserIds = liveblockUsers
    .filter((user) =>
      text ? user.name.toLowerCase().includes(text.toLowerCase()) : true
    )
    .map((user) => user.id);

  return NextResponse.json(filteredUserIds);
}