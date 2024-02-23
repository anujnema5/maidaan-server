import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath: any)=> {
    try {
        if(!localFilePath) return null;

        // upload the file on cloudiary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image'
        })

        console.log("File is uploaded on cloudiary ", response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        // removes the locally saved temp file as the upload operation got failed
        return null;
    }
}