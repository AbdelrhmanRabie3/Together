import axios from "axios";
import { toast } from "sonner";

//image validation
 export const validateImage = (file) => {
    if (!file) return true;
    const maxSize = 32 * 1024 * 1024; //32 MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file.size > maxSize) {
      toast.error("Image must be less than 32 MB.");
      return false;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG images are supported.");
      return false;
    }
    return true;
  };


//upload image to imagebb
 export const uploadImageToImgBb = async (file) => {
    if (!file) {
      return null;
    }
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      console.log(response);
      return response.data.data.url;
    } catch (error) {
      console.log(error);
    }
  };