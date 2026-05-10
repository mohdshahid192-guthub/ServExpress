import { v2 as cloudinary} from "cloudinary";
import fs from "fs"


    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_API_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_PASSWORD
    });

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null
    }else{
     const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        transformation: [ {width: 500, height: 500, crop: 'fill', gravity: "face"}, {fetch_format: "auto", quality: "auto"}]
      })
      console.log("file has been uploaded on cloudinary", response.url);
      
      fs.unlinkSync(localFilePath);
      return response
    }

    
  } catch (error) {
      fs.unlinkSync(localFilePath);
  return null
  }
}

export {uploadOnCloudinary}