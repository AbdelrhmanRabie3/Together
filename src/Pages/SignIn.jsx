import { useContext, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { ThemeContext } from "../components/context/ThemeContextProvider";
import { Mail, Moon, Shield, Sun, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "../utils/schema";
//firebase import
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function SignIn() {
  const [generalError, setGeneralError] = useState("");
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
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
              Sign In
            </h1>
            <span className="text-muted-foreground text-sm text-center font-medium">
              Enter your credentials to continue
            </span>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-5 px-6 py-3">
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
              <div className="flex justify-end py-2">
                <Link
                  to="/ForgetPassword"
                  className="text-muted-foreground text-xs hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-base bg-primary/90 text-primary-foreground hover:bg-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-xl"
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

export default SignIn;
