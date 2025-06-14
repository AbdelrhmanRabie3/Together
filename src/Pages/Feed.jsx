import { useContext, useEffect, useState } from "react";
import NavBar from "./../components/ui/NavBar";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/button";
import {
  MessageCircle,
  Edit,
  Trash2,
  ChevronDown,
  Send,
  Heart,
  Image,
} from "lucide-react";
import { ThemeContext } from "../components/context/ThemeContextProvider";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../components/ui/Card";
//firebase imports
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

function Feed() {
  const { isDark } = useContext(ThemeContext);
  const [posts, setPosts] = useState([]);
  const auth = getAuth();

  console.log(posts);

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
        </div>
      </div>
    </>
  );
}

export default Feed;
