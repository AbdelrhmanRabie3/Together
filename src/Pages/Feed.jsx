import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthContext } from "../components/context/AuthContextProvider";
import { ThemeContext } from "../components/context/ThemeContextProvider";

import axios from "axios";

import NavBar from "./../components/ui/NavBar";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import {
  MessageCircle,
  Edit,
  Trash2,
  ChevronDown,
  Send,
  Heart,
  Image,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../components/ui/Card";

import { nullable, z } from "zod";
//firebase imports
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

function Feed() {
  const { isDark } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [postsLoading, setPostsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  // console.log(posts);
  //Get posts from firebase db
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        likes: doc.data().likes || [],
        comments: doc.data().comments || [],
        imageUrl: doc.data().imageUrl || null,
      }));
      setPosts(
        postsData.sort(
          (a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()
        )
      );
      setPostsLoading(false);
      // console.log(user);
    });
    return () => unsubscribe();
  }, [db]);

  //post validation
  const postSchema = z.object({
    content: z
      .string()
      .min(1, "Content is required.")
      .max(500, "Max 500 characters."),
  });

  //image validation
  const validateImage = (file) => {
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
  const uploadImageToImgBb = async (file) => {
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
      const currentPost = posts.find((p) => p.id === editingPostId);
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
     
  if (postsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary animate-fade-in-up">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-violet-500" />
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Loading feed...
        </p>
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {user && (
            <Card className="mb-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up">
              <form onSubmit={handleSubmitPost(onSubmitPost)} noValidate>
                <CardContent className="pt-6 space-y-4">
                  <Input
                    {...registerPost("content")}
                    placeholder="Share your thoughts..."
                    className={`bg-transparent border-none text-lg font-medium placeholder-zinc-400 dark:placeholder-zinc-500 focus:ring-0 ${
                      postErrors.content
                        ? "border-destructive ring-destructive"
                        : ""
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
          )}

          {posts.map((post) => {
            return (
              <Card
                key={post.id}
                className="mb-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up"
              >
                <CardHeader className="flex flex-row items-center justify-between pt-5">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-violet-500 text-white shadow-sm text-lg font-bold">
                      {post.displayName?.charAt(0).toUpperCase()}
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
                          onClick={() => deletePost(post.id)}
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
                          {isSubmittingEdit ? "Saving..." : "Save"}
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
                          className="w-full h-auto max-h-80  rounded-2xl shadow-md"
                          loading="lazy"
                        />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Feed;
