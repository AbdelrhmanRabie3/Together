import { useContext, useEffect, useRef, useState } from "react";
import NavBar from "./../components/ui/NavBar";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
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
} from "lucide-react";
import { ThemeContext } from "../components/context/ThemeContextProvider";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../components/ui/Card";

import { z } from "zod";
//firebase imports
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function Feed() {
  const { isDark } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const auth = getAuth();

  console.log(posts);
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
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          {auth.currentUser && (
            <Card className="mb-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up">
              <form noValidate>
                <CardContent className="pt-6 space-y-4">
                  <Input />
                  {/* {registerPost("content")} */}
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
                      accept="image/jpeg,image/png"
                      className="hidden"
                    />
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-4">
                  <Button
                    type="submit"
                    className="ml-auto h-10 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 focus:ring-2 focus:ring-blue-500/60 shadow-lg transition-all duration-200 disabled:opacity-70"
                    // disabled={isSubmittingPost}
                  >
                    {/* {isSubmittingPost ? "Posting..." : "Post"} */}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {posts.map((post) => {
            console.log(post);

            return (
              <Card
                key={post.id}
                className="mb-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up"
              >
                <CardHeader className="flex flex-row items-center justify-between pt-5">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-violet-500 text-white shadow-sm text-lg font-bold">
                      {post.username?.charAt(0).toUpperCase()}
                    </span>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-violet-400 text-sm">
                      {post.username}
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {post.timestamp?.toDate().toLocaleString()}
                      </p>
                    </div>
                    {auth.currentUser?.uid === post.userId && (
                      <div className="relative">
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
                            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-md mx-1 my-1">
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-b-xl transition-all duration-200">
                              <Trash2 className=" hover:text-red-700 h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
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
