import { useContext, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "./context/AuthContextProvider";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { Button } from "./ui/Button";
import { Input } from "./ui/input";
import { Send } from "lucide-react";

function AddComment({ post }) {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState({});
  const handleComment = async (postId, commentText) => {
    if (!user) {
      toast.error("Please log in to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          id: Date.now().toString(),
          userId: user.uid,
          username: user.displayName,
          text: commentText,
          timestamp: new Date(),
        }),
      });
      toast.success("Comment added!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };
  return (
    <>
      <Input
        placeholder="Write a comment..."
        value={commentText[post.id] || ""}
        onChange={(e) =>
          setCommentText((prev) => ({
            ...prev,
            [post.id]: e.target.value,
          }))
        }
        className="flex-1"
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleComment(post.id, commentText[post.id]);
            setCommentText((prev) => ({
              ...prev,
              [post.id]: "",
            }));
          }
        }}
      />
      <Button
        size="sm"
        onClick={() => {
          handleComment(post.id, commentText[post.id]);
          setCommentText((prev) => ({
            ...prev,
            [post.id]: "",
          }));
        }}
        disabled={!commentText[post.id]?.trim()}
        className="px-4"
      >
        <Send className="h-4 w-4" />
      </Button>
    </>
  );
}

export default AddComment;
