import { writeFile } from "fs/promises";
import path from "path";

export const getFilePathOnUpload = async function (file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "public/images", filename);
    
    try {
        await writeFile(filePath, buffer);
        return filePath;
    } catch (err) {
        console.error("Error uploading file to folder:", err);
        throw new Error("Error uploading file to folder");
    }
};
