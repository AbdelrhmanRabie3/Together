import { useContext } from "react";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/Card";
import { ThemeContext } from "../components/context/ThemeContextProvider";
import { Mail, Moon, Sun, Lock } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function ForgetPassword() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email("Invalid email format"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, values.email);
      toast.success("Password reset email sent! Please check your inbox.");
      navigate("/signin");
    } catch (err) {
      let errorMessage = "Failed to send reset email. Please try again.";
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 relative">
        <Button
          className="fixed top-5 right-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-full transition-shadow shadow-md hover:shadow-lg text-foreground"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5 animate-spin-slow" /> : <Moon className="h-5 w-5 animate-pulse" />}
        </Button>

        <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up">
          <CardHeader className="flex flex-col gap-3 items-center mt-2">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-violet-700 shadow-md">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-center mt-2 mb-0 text-zinc-900 dark:text-zinc-100">
              Forgot Password
            </h1>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm text-center font-medium">
              Enter your email to reset your password
            </span>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-5 px-6 py-3">
              {errors.root && (
                <div className="text-destructive text-center text-sm font-semibold pb-2">
                  {errors.root.message}
                </div>
              )}
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200"
              >
                <Mail className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                Email
              </label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@email.com"
                className={
                  errors.email ? "border-destructive ring-destructive" : ""
                }
              />
              {errors.email && (
                <div className="text-destructive text-xs mt-1 font-medium">
                  {errors.email.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 focus:ring-2 focus:ring-blue-500/60 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Email..." : "Send Reset Email"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="py-6 flex flex-col gap-2">
            <span className="font-normal text-gray-500 dark:text-gray-300">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </span>
            <span className="font-normal text-gray-500 dark:text-gray-300">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default ForgetPassword;