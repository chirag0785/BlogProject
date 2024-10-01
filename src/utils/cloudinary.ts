import {v2 as cloudinary} from "cloudinary";
import { UploadApiResponse,UploadApiErrorResponse } from "cloudinary";
import fs from "fs";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult extends UploadApiResponse{
    public_id:string,
}
export const uploadOnCloudinary=async function(file:File) : Promise<any>{
    if(!file){
        return null;
    }

    const bytes=await file.arrayBuffer();
    const buffer=Buffer.from(bytes);

    try{
        const result=await new Promise<CloudinaryUploadResult>((resolve,reject)=>{
            const uploadStream=cloudinary.uploader.upload_stream((error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result as CloudinaryUploadResult);
                }
            })
            uploadStream.end(buffer);
        })

        console.log("File is uploaded successfully");
        return result;
    }catch(err){
        console.error("Error uploading file on cloudinary");
        throw new Error("Error uploading file on cloudinary")
    }
}
export const uploadVideoOnCloudinary=async function(file:File) : Promise<any>{
    if(!file){
        return null;
    }

    const bytes=await file.arrayBuffer();
    const buffer=Buffer.from(bytes);

    try{
        const result=await new Promise<CloudinaryUploadResult>((resolve,reject)=>{
            const uploadStream=cloudinary.uploader.upload_stream({resource_type:"video",quality:'auto'},(error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result as CloudinaryUploadResult);
                }
            })
            uploadStream.end(buffer);
        })

        console.log("Video is uploaded successfully");
        return result;
    }catch(err){
        console.error("Error uploading Video on cloudinary");
        throw new Error("Error uploading video on cloudinary")
    }
}