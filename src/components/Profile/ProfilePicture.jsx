import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { uploadImageToImgBb, validateImage } from "../../utils/imageUpload";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Edit2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
function ProfilePicture({ user }) {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const updateProfileImage = async (imageFile) => {
    if (!validateImage(imageFile)) return;

    try {
      setLoading(true);
      const imageUrlResponse = await uploadImageToImgBb(imageFile);
      const url = imageUrlResponse;
      await updateProfile(user, { photoURL: url });
      await user.reload();

      setUser(user);
      // Update all posts by this user with the new photoURL
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const updatePromises = [];
      querySnapshot.forEach((docSnap) => {
        updatePromises.push(updateDoc(docSnap.ref, { photoURL: url }));
      });
      await Promise.all(updatePromises);
      setLoading(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-32 w-32">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/90 border-t-transparent" />
        </div>
      ) : (
        <div className="relative group">
          <Avatar className="h-32 w-32 ring-4 ring-primary/20 shadow-xl">
            <AvatarImage src={user.photoURL} alt={user.displayName} />
            <AvatarFallback className="text-2xl bg-primary/90 text-primary-foreground">
              {user.displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="profileImage"
            className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
          >
            <Edit2 className="h-6 w-6 text-white" />
            <input
              id="profileImage"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={(e) => updateProfileImage(e.target.files[0])}
            />
          </label>
        </div>
      )}
    </>
  );
}

export default ProfilePicture;
