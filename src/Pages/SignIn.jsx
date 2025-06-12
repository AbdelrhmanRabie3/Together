import { useContext } from "react";
import { Button } from "../components/ui/button";
import { Card, CardHeader } from "../components/ui/card";
import { ThemeContext } from "../components/context/Theme-provider";
import { Moon, Sun } from "lucide-react";

function SignIn() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 relative">
        <Button
          className="fixed top-5 right-5 bg-white/80 dark:bg-zinc-800/80 ackdrop-blur-md rounded-full transition-shadow shadow-md hover:shadow-lg text-foreground"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </>
  );
}

export default SignIn;
