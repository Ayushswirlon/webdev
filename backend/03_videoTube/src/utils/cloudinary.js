import cloudinary from "cloudinary";

//config cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file uploaded on cloudinary , file src: " + response.url);
    //once file is uploaded , we would like to delete it from our server
    fs.unlinkSync(localFilePath);
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
