import { useContext, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/Card";
import { ThemeContext } from "../components/context/ThemeContextProvider";
import { Mail, Moon, Shield, Sun, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//firebase import
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
function SignIn() {
  const [generalError, setGeneralError] = useState("");
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const signInSchema = z.object({
    email: z
      .string()
      .min(1, {
        message: "Email is required.",
      })
      .email("Invalid email format"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
  });
  const onSubmit = async (values) => {
    setGeneralError("");
    try {
      const auth = getAuth();
      const userCredintials = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      navigate("/");
      toast.success("Signed in successfully");
    } catch (err) {
      console.log(err.code);

      let errorMessage = "Invalid email or password";
      setError("root", {
        type: "manual",
        message: errorMessage,
      });
      setGeneralError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br  from-blue-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 relative">
        <Button
          className="fixed top-5 right-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-full transition-shadow shadow-md hover:shadow-lg text-foreground"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800/40 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/95 animate-fade-in-up">
          <CardHeader className="flex flex-col gap-3 items-center mt-2">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-md">
              <UserRound size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-center mt-2 mb-0 text-zinc-900 dark:text-zinc-100">
              Sign In
            </h1>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm text-center font-medium">
              Enter your credentials to continue
            </span>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-5 px-6 py-3">
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
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200"
              >
                <Shield className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                Password
              </label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                className={
                  errors.password ? "border-destructive ring-destructive" : ""
                }
              />
              {errors.password && (
                <div className="text-destructive text-xs mt-1 font-medium">
                  {errors.password.message}
                </div>
              )}
              <div className="flex justify-end py-2">
                <Link
                  to="/ForgetPassword"
                  className="text-gray-600 dark:text-gray-300 text-xs hover:underline focus:outline-none"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 focus:ring-2 focus:ring-blue-500/60 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
              {errors.root && (
                <div className="text-destructive text-center text-sm font-semibold pb-2">
                  {errors.root.message}
                </div>
              )}
            </CardContent>
          </form>
          <CardFooter className="py-6">
            <span className="font-normal text-gray-500 dark:text-gray-300">
              Don't have an account?
              <Link
                to="/signup"
                className="ml-1 text-primary font-semibold hover:underline"
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

export default SignIn;
