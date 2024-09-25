import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import BlogModel from "@/model/Blog";
import { getUpcomingBadges } from "@/utils/getUpcomingBadges";
import { assignBatches } from "@/lib/assignBatches";
export async function GET(request: Request, route: { params: { username: string } }) {
    await dbConnect();
    const { username } = route.params;
    try {
        const foundUser = await UserModel.findOne({ username: username.toLowerCase() })
            .populate({
                path:'blogs.blogId',
                model:BlogModel,
                select:"-content"
            });
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const upcomingbadges=getUpcomingBadges({wordCount:foundUser.wordCount,likes:foundUser.likes,comments:foundUser.comments});

        await assignBatches(foundUser._id as string);
        return Response.json({
            success: true,
            message: "Blogs fetched success",
            user:foundUser,
            upcomingbadges
        }, { status: 200 })
    } catch (err) {
        return Response.json({
            success: false,
            message: "Internal server error while fetching blogs",
        }, { status: 500 })
    }
}