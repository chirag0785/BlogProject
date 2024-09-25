import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
export async function POST(request: Request, route: { params: { username: string } }) {

    await dbConnect();
    const { verifyCode } = await request.json();
    const { username } = route.params;

    try {
        const foundUser = await UserModel.findOne({ username });

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not exists with the username"
            }, { status: 404 });
        }

        if(foundUser.isVerified){
            return Response.json({
                success: false,
                message: "User already verified"
            }, { status: 401 });
        }

        if(foundUser.verifyCodeExpiry < new Date(Date.now())){ //verification code expired
            return Response.json({
                success:false,
                message:"Verification Code expired ,signup again"
            },{status:401});
        }

        if(foundUser.verifyCode!==verifyCode){
            return Response.json({
                success:false,
                message:"Verification Code incorrect, try again"
            },{status:401});
        }

        foundUser.isVerified=true;
        await foundUser.save();

        
        return Response.json({
            success:true,
            message:"Verification complete success"
        },{status:200})
    } catch (err) {
        return Response.json({
            success:false,
            message:"Internal Server Error while verifying"
        },{status:500});
    }

}