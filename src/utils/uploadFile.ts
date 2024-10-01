import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const uploadToS3 = async function (file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const filename = `${timestamp}_${sanitizedFilename}`;

    const params = {
        Bucket: "your-bucket-name", // replace with your S3 bucket name
        Key: filename, // the file's name
        Body: buffer,
        ContentType: file.type,
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // the URL of the uploaded file
    } catch (err) {
        console.error("Error uploading file to S3:", err);
        throw new Error("Error uploading file to S3");
    }
};
