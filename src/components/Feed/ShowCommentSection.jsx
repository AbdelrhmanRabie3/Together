import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import AddComment from "./AddComment";
function ShowCommentSection({ post, showComments }) {
  const { user } = useContext(AuthContext);

  return (
    <>
      {showComments[post.id] && (
        <div className="space-y-4">
          {user && (
            <div className="flex gap-3">
              <AddComment post={post} />
            </div>
          )}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {post.comments?.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-violet-500 text-white shadow-sm text-sm font-bold flex-shrink-0">
                  {comment.username?.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {comment.username}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {comment.timestamp instanceof Date
                        ? comment.timestamp.toLocaleString()
                        : new Date(
                            comment.timestamp?.seconds * 1000
                          ).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default ShowCommentSection;
