import { useContext, useState } from "react";
import { Button } from "../components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { ThemeContext } from "../components/context/ThemeContextProvider";
import { Mail, Moon, Shield, Sun, User, UserRound } from "lucide-react";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { toast, Toaster } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
//firebase imports
import { getAuth,createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { db } from "../firebase.config";
import { setDoc,doc,serverTimestamp } from "firebase/firestore";

function SignUp() {
  const [generalError, setGeneralError] = useState("");
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const signUpSchema = z
    .object({
      username: z.string().min(1, { message: "username is required." }),
      email: z
        .string()
        .min(1, { message: "Email is required." })
        .email("Invalid email format"),
      password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().trim().min(1, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });
  const onSubmit = async (values) => {
    setGeneralError("");
    try {
      const auth=getAuth()
      const userCredential=await createUserWithEmailAndPassword(auth,values.email,values.password)
      await updateProfile(userCredential.user, {
        displayName: values.username,
      });
      console.log(userCredential);
      await setDoc(doc(db,"users",userCredential.user.uid),{
        userId: userCredential.user.uid,
        username: values.username,
        email: values.email,
        createdAt:serverTimestamp()
      })
      navigate("/signin");
      toast.success("Account created successfully! Please sign in.");
    } catch (err) {
      let errorMessage = "Sign up failed. Please try again.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email is already registered.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }
      setError("root.server", {
        type: "manual",
        message: errorMessage || "Sign up failed. Please try again.",
      });
      toast.error(errorMessage || "Sign up failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900 relative">
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
              Sign Up
            </h1>
            <span className="text-gray-600 dark:text-gray-300 text-base font-medium">
              Join thousands of users worldwide ✨
            </span>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-4 px-6 py-2">
              {errors.root?.server && (
                <div className="text-destructive text-center text-sm font-semibold pb-2">
                  {errors.root.server.message}
                </div>
              )}
              <label
                htmlFor="fullName"
                className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200"
              >
                <User className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                UserName
              </label>
              <Input
                {...register("username")}
                id="username"
                type="text"
                placeholder="e.g. Abdelrhman Rabie"
                className={
                  errors.username ? "border-destructive ring-destructive" : ""
                }
              />
              {errors.username && (
                <div
                  className="text-destructive text-xs mt-1 font-medium"
                  id="username-error"
                >
                  {errors.username.message}
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
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200"
              >
                <Shield className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                Confirm Password
              </label>
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="Type password again"
                className={
                  errors.confirmPassword
                    ? "border-destructive ring-destructive"
                    : ""
                }
              />
              {errors.confirmPassword && (
                <div
                  className="text-destructive text-xs mt-1 font-medium"
                  id="confirmPassword-error"
                >
                  {errors.confirmPassword.message}
                </div>
              )}
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-base bg-gradient-to-r from-blue-500 to-violet-700 hover:from-blue-600 hover:to-violet-800 focus:ring-2 focus:ring-blue-500/60 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="py-6">
            <span className="font-normal text-gray-500 dark:text-gray-300">
              Already have an account?
              <Link
                to="/signin"
                className="ml-1 text-primary font-semibold hover:underline"
              >
                Sign In
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
