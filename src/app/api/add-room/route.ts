import { dbConnect } from "@/lib/dbConnect";
import RoomModel from "@/model/Room";
import { NextRequest, NextResponse } from "next/server";
import {liveblocks} from "@/lib/liveblocks";
import { Blog } from "@/model/Blog";
import {supabaseClient} from "@/lib/supabase";
export async function POST(request:NextRequest){
    await dbConnect();
    const {id,blog}:{id:any,blog:Blog}=await request.json();
    if(!id){
        return NextResponse.json({
            success:false,
            message:"Missing id"
        },{status:400})
    }
    try{
        const room=await RoomModel.create({
            owner:id,
            topic:blog?.topic || "Untitled",
            heading:blog?.heading || "Untitled",
            accessToAll:blog?.accessToAll || false,
            editAccess:blog?.editAccess || [],
        })

        if(blog){
            room.blogId=blog?._id as string;
        }

        if(!blog){
            room.editAccess.push(id);
        }
        await room.save();
        const userAccesses:any={};
        room.editAccess.forEach((userId:any)=>{
            userAccesses[userId]=["room:write"];
        })
        const liveblockRoom = await liveblocks.createRoom(`blog-room:${room._id}`, {
            defaultAccesses: [],
            usersAccesses: userAccesses
        });

        // await liveblocks.initializeStorageDocument(`blog-room:${room._id}`,{
        //     data:{
        //         doc:{
        //             type:"doc",
        //             content:[]
        //         }
        //     },
        //     liveblocksType:"LiveObject"
        // })
        return NextResponse.json({
            success:true,
            roomId:room._id
        },{status:200})
    }catch(err){
        console.error(err);
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
    }
}