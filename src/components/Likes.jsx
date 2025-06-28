import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContextProvider";
import { Heart } from "lucide-react";

function Likes({ post, isLiked, likesCount }) {
  const { user } = useContext(AuthContext);
  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like posts");
      return;
    }

    try {
      const postRef = doc(db, "posts", post.id);
      const isLiked = post.likes.includes(user.uid);
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid),
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Failed to update like");
    }
  };
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 ${
          isLiked
            ? "text-red-600 dark:text-red-400"
            : "text-zinc-600 dark:text-zinc-400"
        }`}
        onClick={() => handleLike(post.id)}
        disabled={!user}
      >
        <Heart
          className={`h-5 w-5 transition-all duration-200 ${
            isLiked ? "fill-current" : ""
          }`}
        />
        <span className="font-medium">
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </span>
      </Button>
    </>
  );
}

export default Likes;
