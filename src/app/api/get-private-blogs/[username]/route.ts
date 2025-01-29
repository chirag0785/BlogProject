import { dbConnect } from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import UserModel from "@/model/User";

export async function GET(request: Request, route: { params: { username: string } }) {
    await dbConnect();
    const { username } = route.params;
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        const blogs=await BlogModel.find({creator:username,public:false}).select("-content");
        return Response.json({
            success:true,
            message:`Private blogs of ${username} fetched success`,
            blogs
        },{status:200});
    } catch (err) {
        return Response.json({
            success: false,
            message: `Internal server error while fetching blogs`,
        }, { status: 500 })
    }
}