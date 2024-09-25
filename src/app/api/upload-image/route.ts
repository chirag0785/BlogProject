import { uploadOnCloudinary } from "@/utils/cloudinary";
import { getFilePathOnUpload } from "@/utils/uploadImage";

export async function POST(request:Request){
    const formData=await request.formData();

    const file=formData.get('image') as File || null;

    if (!file) {
        return Response.json(
            {
                success: false,
                message: "Image not provided",
            },
            { status: 401 }
        );
    }
    let filePath, response;
    try {
        filePath = await getFilePathOnUpload(file);
        response = await uploadOnCloudinary(filePath);

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

    return Response.json({
        success:true,
        message:"Image upload success",
        url:response.secure_url
    },{status:200});
}