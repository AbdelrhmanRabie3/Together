import { useContext } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { ThemeContext } from "../components/context/ThemeContextProvider";
import { Mail, Moon, Sun, Lock } from "lucide-react";
import { Input } from "../components/ui/input";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { forgotPasswordSchema } from "../utils/schema";

function ForgetPassword() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Button
          className="fixed top-5 right-5 bg-card/50 hover:bg-card/80 backdrop-blur-xl rounded-full transition-all shadow-lg hover:shadow-xl text-foreground"
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

        <Card className="w-full max-w-md shadow-2xl rounded-3xl border-border/50 backdrop-blur-2xl bg-card/95 animate-fade-in-up">
          <CardHeader className="flex flex-col gap-3 items-center mt-2">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary/90 text-primary-foreground shadow-xl ring-2 ring-primary/20">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-center mt-2 mb-0 text-foreground bg-clip-text">
              Forgot Password
            </h1>
            <span className="text-muted-foreground text-sm text-center font-medium">
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
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-base bg-primary/90 text-primary-foreground hover:bg-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Email..." : "Send Reset Email"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="py-6 flex flex-col gap-2">
            <span className="text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/signin"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign In
              </Link>
            </span>
            <span className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
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
