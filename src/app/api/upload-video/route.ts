import { uploadVideoOnCloudinary } from "@/utils/cloudinary";
export async function POST(request:Request){
    const formData=await request.formData();
    const video=formData.get('video') as File || null;
    if(!video){
        return Response.json(
            {success:false,url:""}
        ,{status:404});
    }
    let filePath, response;
    try {
        filePath = await getFilePathOnUpload(video);
        response = await uploadVideoOnCloudinary(filePath);
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
        message:"Video upload success",
        url:response.secure_url
    },{status:200});
}