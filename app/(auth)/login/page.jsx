"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/ui/Input";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Logging in...");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error("Login failed. Please check your credentials.", { id: toastId });
    } else {
      toast.success("Login successful!", { id: toastId });
      // Redirect based on role after successful login
      if (session?.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (status === "authenticated") {
      if (session?.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg flex overflow-hidden">
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image src="/logo.png" alt="Zando Logo" width={150} height={50} />
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Log in to your Zando account.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:bg-gray-400">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="w-full border-gray-300 dark:border-gray-600" />
            <span className="text-gray-400 dark:text-gray-500 text-sm px-4">OR</span>
            <hr className="w-full border-gray-300 dark:border-gray-600" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <img src="/google-20.png" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-black dark:text-white font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
        <div className="hidden lg:block w-1/2 relative">
          <Image src="/ban2.jpg" alt="Fashion model" layout="fill" objectFit="cover" />
        </div>
      </div>
    </div>
  );
}
