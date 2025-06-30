import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { uploadImageToImgBb, validateImage } from "../../utils/imageUpload";
import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { Edit2, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { toast } from "sonner";
function ProfilePicture() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const editAllUserPostsPhotoURL = async (photoURL) => {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const updatePromises = [];
    if (photoURL) {
      querySnapshot.forEach((docSnap) => {
        updatePromises.push(updateDoc(docSnap.ref, { photoURL: photoURL }));
      });
    } else {
      querySnapshot.forEach((docSnap) => {
        updatePromises.push(updateDoc(docSnap.ref, { photoURL: "" }));
      });
    }
    await Promise.all(updatePromises);
  };
  const updateProfileImage = async (imageFile) => {
    if (!validateImage(imageFile)) return;
    try {
      setLoading(true);
      const imageUrlResponse = await uploadImageToImgBb(imageFile);
      const url = imageUrlResponse;
      const auth = getAuth();
      await updateProfile(auth.currentUser, { photoURL: url });
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      editAllUserPostsPhotoURL(url);
      setLoading(false);
      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error("Failed to update profile image");
      setLoading(false);
    }
  };

  const removeProfileImage = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      await updateProfile(auth.currentUser, { photoURL: "" });
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      editAllUserPostsPhotoURL("");
      setShowRemoveConfirm(false);
      toast.success("Profile picture removed successfully");
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setLoading(false);
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
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <label
              htmlFor="profileImage"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
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
            {user.photoURL && (
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/90 text-destructive-foreground hover:bg-destructive cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setShowRemoveConfirm(true)}
              >
                <Trash2 className="text-white h-5 w-5" />
              </button>
            )}
          </div>
          {showRemoveConfirm && (
            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg p-4 shadow-xl w-64 text-center">
              <p className="text-sm text-foreground mb-3">
                Are you sure you want to remove your profile picture?
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeProfileImage}
                  disabled={loading}
                >
                  {loading ? "Removing..." : "Remove"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRemoveConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ProfilePicture;
