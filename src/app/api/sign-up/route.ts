import sendVerificationEmail from "@/helpers/sendVerificationEmail";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { uploadOnCloudinary } from "@/utils/cloudinary";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
    await dbConnect();
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const file = (formData.get("image") as File) || null;
    //check for existing user
    const existingUserByUsername = await UserModel.findOne({
        username: username.toLowerCase(),
    });

    if (existingUserByUsername?.isVerified) {
        return Response.json(
            {
                success: false,
                message: "User already exists with the username",
            },
            { status: 401 }
        );
    }
    const exisitingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (exisitingUserByEmail) {
        if (exisitingUserByEmail.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists with the email",
                },
                { status: 401 }
            );
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            exisitingUserByEmail.username = username;
            exisitingUserByEmail.password = hashedPassword;
            exisitingUserByEmail.name = name;
            exisitingUserByEmail.isVerified = false;
            exisitingUserByEmail.verifyCode = verifyCode;
            exisitingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 7200000);
            await exisitingUserByEmail.save();
        }
    } else {
        if (!file) {
            return Response.json(
                {
                    success: false,
                    message: "Profile Image not provided",
                },
                { status: 401 }
            );
        }
        let response;
        try {
            response = await uploadOnCloudinary(file);
            if (!response) {
                return Response.json(
                    {
                        success: false,
                        message: "File path not correct, no file found",
                    },
                    { status: 500 }
                );
            }
        } catch (err) {
            return Response.json(
                {
                    success: false,
                    message: "Error while uploading to cloudinary",
                },
                { status: 500 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            username,
            email,
            name,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: new Date(Date.now() + 7200000),
            profileImg: response.secure_url,
        });
    }


    try{
        const response=await sendVerificationEmail({username,verifyCode,email});
        console.log(response);
        if(!response){
            return Response.json(
                {
                    success: false,
                    message: "Failed to send email: No response data received.",
                },
                { status: 404 }
            );
        }
    }catch(err){
        return Response.json(
            {
                success: false,
                message: "Email not able to sent right now",
            },
            { status: 500 }
        );
    }


    return Response.json({
        success:true,
        message:"User signup success , now verify the email"
    },{status:200})
}
