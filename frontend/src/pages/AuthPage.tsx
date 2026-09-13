import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";

export function AuthPage({
  mode = "login",
}: {
  mode: "login" | "register";
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    try {
      if (mode === "register") {
        const fullName = `${firstName} ${lastName}`.trim();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              full_name: fullName,
              password,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.detail?.[0]?.msg ||
              data?.detail ||
              "Registration failed"
          );
        }

        toast.success("Account created successfully!");

        navigate("/login");
        return;
      }

      // LOGIN
      const loginData = new URLSearchParams();
      loginData.append("username", email);
      loginData.append("password", password);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: loginData.toString(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail?.[0]?.msg ||
            data?.detail ||
            "Login failed"
        );
      }

      localStorage.setItem(
        "medivision_access_token",
        data.access_token
      );

      localStorage.setItem(
        "medivision_token_type",
        data.token_type || "bearer"
      );

      toast.success("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-center items-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] space-y-6"
        >
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <Link
              to="/"
              className="flex items-center justify-center lg:justify-start gap-2 mb-6"
            >
              <Activity className="h-6 w-6 text-primary" />

              <span className="font-bold text-xl tracking-tight">
                MediVision AI
              </span>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "login"
                ? "Welcome back"
                : "Create an account"}
            </h1>

            <p className="text-muted-foreground text-sm">
              {mode === "login"
                ? "Enter your credentials to access your dashboard"
                : "Enter your details to create your health portal account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First name
                  </Label>

                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last name
                  </Label>

                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  Password
                </Label>

                {mode === "login" && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />

                <Label
                  htmlFor="remember"
                  className="text-sm font-normal"
                >
                  Remember me
                </Label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            type="button"
            className="w-full"
            disabled
          >
            Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}

            <Link
              to={mode === "login" ? "/register" : "/login"}
              className="text-primary hover:underline font-medium"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900/50 p-12 border-l relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-[size:20px_20px]" />

        <div className="z-10 text-center max-w-lg space-y-6">
          <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-xl border mb-8 mx-auto w-[80%] transform -rotate-2">
            <div className="h-40 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
              <Activity className="h-16 w-16 text-blue-500 opacity-50" />
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Hospital-grade AI in your pocket.
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            Join thousands of patients securely managing and
            analyzing their health records with state-of-the-art
            AI technology.
          </p>
        </div>
      </div>
    </div>
  );
}