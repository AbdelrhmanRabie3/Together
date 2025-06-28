import { useContext, useState } from "react";
import { Button } from "../components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ThemeContext } from "../components/context/ThemeContextProvider";
import { Mail, Moon, Shield, Sun, User, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../utils/schema";

//firebase imports
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
function SignUp() {
  const [generalError, setGeneralError] = useState("");
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
  });
  const onSubmit = async (values) => {
    setGeneralError("");
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await updateProfile(userCredential.user, {
        displayName: values.username,
      });
      console.log(userCredential);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        userId: userCredential.user.uid,
        username: values.username,
        email: values.email,
        photoURL: null,
        createdAt: serverTimestamp(),
      });
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Button
          className="fixed top-5 right-5 bg-card/50 hover:bg-card/80 backdrop-blur-xl rounded-full transition-all shadow-lg hover:shadow-xl text-foreground"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Card className="w-full max-w-md shadow-2xl rounded-3xl border-border/50 backdrop-blur-2xl bg-card/95 animate-fade-in-up">
          <CardHeader className="flex flex-col gap-3 items-center mt-2">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary/90 text-primary-foreground shadow-xl ring-2 ring-primary/20">
              <UserRound size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-center mt-2 mb-0 text-foreground bg-clip-text">
              Sign Up
            </h1>
            <span className="text-muted-foreground text-base font-medium">
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
                className="flex items-center gap-2 text-sm font-bold text-foreground/90"
              >
                <User className="w-4 h-4" />
                UserName
              </label>
              <Input
                {...register("username")}
                id="username"
                type="text"
                placeholder="e.g. Abdelrhman Rabie"
                className={`dark:bg-input dark:text-foreground dark:placeholder:text-muted-foreground/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${
                  errors.username ? "border-destructive ring-destructive/20" : ""
                }`}
              />

              <label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-bold text-foreground/90"
              >
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="name@email.com"
                className={`dark:bg-input dark:text-foreground dark:placeholder:text-muted-foreground/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${
                  errors.email ? "border-destructive ring-destructive/20" : ""
                }`}
              />
              {errors.email && (
                <div className="text-destructive text-xs mt-1 font-medium">
                  {errors.email.message}
                </div>
              )}
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-bold text-foreground/90"
              >
                <Shield className="w-4 h-4" />
                Password
              </label>
              <Input
                {...register("password")}
                id="password"
                type="password"
                className={`dark:bg-input dark:text-foreground dark:placeholder:text-muted-foreground/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${
                  errors.password ? "border-destructive ring-destructive/20" : ""
                }`}
              />
              {errors.password && (
                <div className="text-destructive text-xs mt-1 font-medium">
                  {errors.password.message}
                </div>
              )}
              <label
                htmlFor="confirmPassword"
                className="flex items-center gap-2 text-sm font-bold text-foreground/90"
              >
                <Shield className="w-4 h-4" />
                Confirm Password
              </label>
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type="password"
                placeholder="Type password again"
                className={`dark:bg-input dark:text-foreground dark:placeholder:text-muted-foreground/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 ${
                  errors.confirmPassword ? "border-destructive ring-destructive/20" : ""
                }`}
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
                className="w-full h-11 rounded-xl font-semibold text-base bg-primary/90 text-primary-foreground hover:bg-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
              {errors.username && (
                <div className="text-destructive text-xs mt-1 font-medium">
                  {errors.username.message}
                </div>
              )}
            </CardContent>
          </form>
          <CardFooter className="py-6">
            <span className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
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
