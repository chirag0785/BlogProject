import { dbConnect } from "@/lib/dbConnect";
import { liveblocks } from "@/lib/liveblocks";
import BlogModel from "@/model/Blog";
import RoomModel from "@/model/Room";
import UserModel from "@/model/User";
import { WebhookHandler } from "@liveblocks/node";
const webhookHandler = new WebhookHandler(process.env.WEBHOOK_SECRET!);
export async function POST(req: Request): Promise<Response> {
  try {
    // Read the raw body of the request
    const rawBody = await req.text();

    // Verify the request
    const event = webhookHandler.verifyRequest({
      headers: Object.fromEntries(req.headers.entries()),
      rawBody,
    });

    // Handle specific event types
    if (event.type === "userLeft") {
      if (event.data.numActiveUsers === 0) {
        console.log("All users left the room" , event.data);
        await dbConnect();
        const roomId = event.data.roomId;
        const yjs = await liveblocks.getYjsDocument(roomId);
        console.log(yjs);

        if(Object.keys(yjs).length === 0){
          console.log("Yjs document not found, empty object returned");
          
          return Response.json({
            success: false,
            message: "Yjs document not found"
          }, { status: 404 })
        }
        const room = await RoomModel.findOne({ _id: roomId.split(':')[1] });
        const roomliveblocks = await liveblocks.getRoom(roomId);

        if (!room || !roomliveblocks) {
          return Response.json({
            success: false,
            message: "Room not found"
          }, { status: 404 })
        }

        const str = yjs["default"]?.toString() || "";
        const textWithoutTags = str.replace(/<[^>]*>/g, '');
        const wordCount = textWithoutTags.split(/\s+/).filter(word => word.length > 0).length;
        const timeToRead = Math.ceil(wordCount / 150);

        const ownerUser=await UserModel.findOne({_id:room.owner});
        if(!ownerUser){
          return Response.json({
            success: false,
            message: "Owner not found"
          }, { status: 404 })
        }

        if(room?.blogId){
          const blog=await BlogModel.findOne({_id:room.blogId});
          if(!blog){
            return Response.json({
              success: false,
              message: "Blog not found"
            }, { status: 404 })
          }

          blog.topic=room?.topic;
          blog.heading=room?.heading;
          blog.content=yjs["default"]?.toString() || "";
          blog.timeToRead=`${timeToRead}m read`;
          blog.creator=ownerUser.username;
          blog.name=ownerUser.name;
          blog.profileImg=ownerUser.profileImg;
          blog.editAccess=room.editAccess;
          blog.accessToAll=room.accessToAll;
          blog.public=false;
          await blog.save();
        }
        else{
          const newBlog = await BlogModel.create({
            topic: room?.topic,
            heading: room?.heading,
            content: yjs["default"]?.toString() || "",
            timeToRead: `${timeToRead}m read`,
            creator: ownerUser.username,
            name: ownerUser.name,
            profileImg: ownerUser.profileImg,
            editAccess: room.editAccess,
            accessToAll: room.accessToAll,
            public: false
          });
        }

        // Delete the room
        await RoomModel.deleteOne({ _id: roomId.split(':')[1] });
        await liveblocks.deleteRoom(roomId);
      }
      console.log("User left event data:", event.data);
    }

    console.log("Webhook event:", event);
    // Return a successful response
    return new Response("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);

    // Return an error response
    return new Response("Invalid webhook request", { status: 400 });
  }
}
