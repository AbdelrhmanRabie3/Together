import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContextProvider";
import { Moon, Sun, UserRound } from "lucide-react";
import { Button } from "./button";
import { getAuth } from "firebase/auth";
import { Link } from "react-router";
function NavBar() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const auth = getAuth();
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);
  return (
    <>
      <nav
        className="w-full flex items-center justify-between px-6 py-4 
      bg-white/80 dark:bg-zinc-900/85 shadow-xl backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800
      fixed top-0 left-0 z-40
      "
      >
        <Link to="/" className="flex items-center gap-2 select-none">
          <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
            <span>Together</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            className=" bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-full transition-shadow shadow-md hover:shadow-lg text-foreground"
            onClick={toggleTheme}
            size="icon"
            variant="ghost"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {user ? (
            <Link
              to=""
              className="flex items-center gap-2 group ml-2 pl-4 border-l border-zinc-100 dark:border-zinc-800"
            >
              {user.avatar ? (
                <img
                  className="w-9 h-9 rounded-full border-2 border-blue-400 shadow"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <span className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-purple-500 text-white shadow text-lg font-bold">
                  <UserRound size={22} className="text-white" />
                </span>
              )}
              <span className="font-semibold text-zinc-700 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-blue-400 text-sm transition">
                {user.name}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                to="/signin"
                className="px-4 py-1.5 rounded-md font-semibold text-base text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-zinc-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-md font-semibold text-base bg-gradient-to-r from-blue-500 to-pink-400 text-white shadow-md hover:from-blue-600 hover:to-pink-500 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
