import { toast } from "sonner";
import { uploadImageToImgBb, validateImage } from "../../utils/imageUpload";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../../utils/schema";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/Dropdown-menu";
import { Button } from "../ui/button";
import {
  Edit,
  Image,
  MessageCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Input } from "../ui/input";
import Likes from "./Likes";
import ShowCommentSection from "./ShowCommentSection";

function PostCard({ post }) {
  const { user } = useContext(AuthContext);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [showComments, setShowComments] = useState({});
  const isLiked = post.likes?.includes(user?.uid);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;
  //Edit post
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors, isSubmitting: isSubmittingEdit },
    reset: resetEdit,
    setValue: setEditValue,
  } = useForm({
    resolver: zodResolver(postSchema),
    mode: "onChange",
  });
  const onSubmitEdit = async (data) => {
    if (editImageFile && !validateImage(editImageFile)) {
      return;
    }
    try {
      const currentPost = post;
      let imageUrl = currentPost?.imageUrl ?? null;
      if (editImageFile) {
        imageUrl = await uploadImageToImgBb(editImageFile);
      }
      await updateDoc(doc(db, "posts", editingPostId), {
        content: data.content,
        timestamp: serverTimestamp(),
        imageUrl: imageUrl,
      });
      setEditingPostId(null);
      setEditImageFile(null);
      resetEdit();
      toast.success("Post updated successfully!");
    } catch (err) {
      toast.error("Failed to update post.");
      console.error(err);
    }
  };
  // Delete post
  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
      toast.success("Post deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete post.");
      console.error(err);
    }
  };
  return (
    <>
      <Card
        key={post.id}
        className="mb-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up"
      >
        <CardHeader className="flex flex-row items-center justify-between pt-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-blue-400 to-violet-500 text-white shadow-sm text-lg font-bold">
              {post.photoURL ? (
                <img src={post.photoURL} />
              ) : (
                post.displayName?.charAt(0).toUpperCase()
              )}
            </span>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-violet-400 text-sm">
              {post.displayName}
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {post.timestamp?.toDate().toLocaleString()}
              </p>
            </div>
          </div>
          {user?.uid === post.userId && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-blue-100/50 dark:hover:bg-zinc-800/50"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="h-6 w-6 text-zinc-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl shadow-xl">
                <DropdownMenuItem
                  className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-md mx-1 my-1"
                  onClick={() => {
                    setEditingPostId(post.id);
                    setEditValue("content", post.content);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-b-xl transition-all duration-200"
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  <Trash2 className=" hover:text-red-700 h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {editingPostId === post.id ? (
            <form onSubmit={handleSubmitEdit(onSubmitEdit)} noValidate>
              <Input
                className="bg-transparent border border-zinc-300 dark:border-zinc-700 text-lg mb-4"
                aria-label="Edit post content"
                {...registerEdit("content")}
              />
              {editErrors.content && (
                <p className="text-destructive text-sm font-medium">
                  {editErrors.content.message}
                </p>
              )}
              <div className="flex items-center gap-3 mb-4">
                <label
                  htmlFor={`edit-image-upload-${post.id}`}
                  className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-violet-400 transition-colors"
                >
                  <Image className="h-6 w-6" />
                  Change Image
                </label>
                <input
                  id={`edit-image-upload-${post.id}`}
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => setEditImageFile(e.target.files[0])}
                />
                {editImageFile && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                    {editImageFile.name}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="h-10 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 shadow-lg transition-all duration-200 hover:scale-105"
                  disabled={isSubmittingEdit}
                  aria-label="Save edited post"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  className="h-10 px-6 rounded-full text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setEditingPostId(null);
                    setEditImageFile(null);
                    resetEdit();
                  }}
                  aria-label="Cancel edit"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-zinc-800 dark:text-zinc-200 text-lg font-medium mb-6">
                {post.content}
              </p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full h-auto max-h-80 rounded-2xl shadow-md"
                  loading="lazy"
                />
              )}
            </>
          )}
        </CardContent>
        {/* Likes and Comments Section */}
        <CardFooter className="px-6 pb-6 pt-0">
          <div className="w-full space-y-4">
            <div className="flex items-center gap-6 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <Likes post={post} isLiked={isLiked} likesCount={likesCount} />
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200"
                onClick={() =>
                  setShowComments((prev) => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">
                  {commentsCount} {commentsCount === 1 ? "Comment" : "Comments"}
                </span>
              </Button>
            </div>
            <ShowCommentSection post={post} showComments={showComments} />
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default PostCard;
