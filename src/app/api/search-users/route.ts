import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "";

    try{
        const users = await UserModel.find({
            email: { $regex: `^${email}`, $options: "i" }
        }).limit(5).select('email');

        let emails:string[]=[];

        users.forEach((user) => {
            emails.push(user.email);
        })

        return NextResponse.json({
            success: true,
            emails
        },{status:200})
    }catch(err){
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 });
    }
}