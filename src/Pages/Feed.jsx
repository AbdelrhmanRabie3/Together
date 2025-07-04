import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/context/AuthContextProvider";
import NavBar from "../components/ui/NavBar";
import { Loader2 } from "lucide-react";
//firebase imports
import { db } from "../firebase.config";
import { collection, onSnapshot } from "firebase/firestore";
import PostForm from "../components/Feed/PostForm";
import PostCard from "../components/Feed/PostCard";

function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [postsLoading, setPostsLoading] = useState(true);
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
    });
    return () => unsubscribe();
  }, [db]);

  if (postsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary animate-fade-in-up">
        <Loader2 className="w-12 h-12 animate-spin text-primary/90" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading feed...
        </p>
      </div>
    );
  }
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background/95 backdrop-blur-sm pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {user && <PostForm />}
          {posts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Feed;
