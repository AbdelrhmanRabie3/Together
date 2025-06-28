import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "../utils/schema";
import { validateImage } from "../utils/imageUpload";
import { uploadImageToImgBb } from "../utils/imageUpload";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "../firebase.config";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContextProvider";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Image } from "lucide-react";

function PostForm() {
  const { user } = useContext(AuthContext);
  const [imageFile, setImageFile] = useState(null);
  //create post
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    formState: { errors: postErrors, isSubmitting: isSubmittingPost },
    reset: resetPost,
  } = useForm({
    resolver: zodResolver(postSchema),
    mode: "onChange",
  });
  const onSubmitPost = async (data) => {
    if (imageFile && !validateImage(imageFile)) {
      return;
    }
    try {
      const imageUrl = await uploadImageToImgBb(imageFile);
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        displayName: user.displayName,
        content: data.content,
        timestamp: serverTimestamp(),
        likes: [],
        comments: [],
        imageUrl,
      });
      toast.success("Post created successfully!");
      resetPost();
      setImageFile(null);
    } catch (error) {
      toast.error("Failed to create post.");
      console.error(error);
    }
  };
  return (
    <>
      <Card className="mb-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up">
        <form onSubmit={handleSubmitPost(onSubmitPost)} noValidate>
          <CardContent className="pt-6 space-y-4">
            <Input
              {...registerPost("content")}
              placeholder="Share your thoughts..."
              className={`bg-transparent border-none text-lg font-medium placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-0 ${
                postErrors.content ? "border-destructive ring-destructive" : ""
              }`}
            />
            {postErrors.content && (
              <p className="text-destructive text-sm font-medium">
                {postErrors.content.message}
              </p>
            )}
            <div className="flex items-center gap-2">
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-violet-400"
              >
                <Image className="h-5 w-5" />
                Add Image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {imageFile && (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                  {imageFile.name}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-4">
            <Button
              type="submit"
              className="ml-auto h-10 px-6 rounded-full font-bold text-sm bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
              disabled={isSubmittingPost || !user}
              aria-label="Submit post"
            >
              {isSubmittingPost ? "Posting..." : "Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}

export default PostForm;
