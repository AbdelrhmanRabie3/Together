import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContextProvider";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { Button } from "./Button";
import { getAuth } from "firebase/auth";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { AuthContext } from "../context/AuthContextProvider";
function NavBar() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);
  const auth = getAuth();
  const navigate = useNavigate();

  async function handleLogOut() {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      toast.error("Error logging out");
      console.error("Logout error:", error);
    }
  }
  return (
    <>
      <nav
        className="w-full flex items-center justify-between px-6 py-3.5 
        bg-white/90 dark:bg-zinc-900/90 shadow-2xl backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50
        fixed top-0 left-0 z-50 transition-all duration-300"
      >
        <Link
          to="/"
          className="flex items-center gap-2 select-none group"
          aria-label="Home"
        >
          <span className="font-extrabold text-3xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-400 bg-clip-text text-transparent drop-shadow-md tracking-tight group-hover:scale-105 transition-transform duration-200">
            Together
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-lg rounded-full shadow-md hover:shadow-xl hover:bg-white/90 dark:hover:bg-zinc-700/90 text-foreground transition-all duration-200"
            onClick={toggleTheme}
            size="icon"
            variant="ghost"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-5 w-5 animate-spin-slow" />
            ) : (
              <Moon className="h-5 w-5 animate-pulse" />
            )}
          </Button>
          {user ? (
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    className="flex items-center gap-2 group rounded-full bg-white/70 dark:bg-zinc-800/70 backdrop-blur-lg px-3 py-1.5 shadow-md hover:shadow-xl hover:bg-white/90 dark:hover:bg-zinc-700/90 transition-all duration-200"
                    aria-label="User menu"
                  >
                    {user.photoURL ? (
                      <img
                        className="w-8 h-8 rounded-full border-2 border-blue-400 shadow-sm group-hover:border-violet-500 transition-all duration-200"
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-violet-500 text-white shadow-sm group-hover:scale-110 transition-transform duration-200">
                        <UserRound size={20} className="text-white" />
                      </span>
                    )}
                    <span className="font-semibold text-zinc-700 group-hover:text-blue-600 dark:text-zinc-200 dark:group-hover:text-violet-400 text-sm transition-colors duration-200 max-w-[120px] truncate">
                      {user.displayName}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem disabled>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-blue-50 dark:hover:bg-zinc-700 hover:text-blue-600 dark:hover:text-violet-400 transition-colors duration-200"
                    >
                      <UserRound className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-b-xl transition-all duration-200"
                      onClick={handleLogOut}
                    >
                      <LogOut className=" text-red-600 hover:text-red-700 h-4 w-4 mr-2" />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="px-4 py-1.5 rounded-full font-semibold text-sm text-blue-500 dark:text-blue-400 bg-transparent hover:bg-blue-100/50 dark:hover:bg-zinc-800/50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-500 to-pink-400 text-white shadow-md hover:shadow-xl hover:from-blue-600 hover:to-pink-500 transition-all duration-200"
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
