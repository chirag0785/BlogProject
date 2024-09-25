import {v2 as cloudinary} from "cloudinary";
import { UploadApiResponse,UploadApiErrorResponse } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
export const uploadOnCloudinary=async function(filePath:string) : Promise<UploadApiResponse|null>{
    if(!filePath){
        return null;
    }
    try{
        const response=await cloudinary.uploader.upload(filePath);
        console.log("File is uploaded successfully",response.secure_url);
        fs.unlinkSync(filePath);
        return response;
    }catch(err){
        fs.unlinkSync(filePath);
        console.error("Error uploading file on cloudinary");
        throw new Error("Error uploading file on cloudinary")
    }
}