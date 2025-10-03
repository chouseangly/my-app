'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { toast, Toaster } from "react-hot-toast";
import Input from "@/components/ui/Input";
import Image from "next/image";
import Link from "next/link";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Missing email. Redirecting to forgot password.");
      router.push("/forgotpassword");
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Missing email.");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await fetch(`${API_BASE_URL}/auths/reset-new-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          newPassword: password,
          confirmPassword: confirm
        }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      toast.success("Password updated successfully! Redirecting to login...", { id: toastId });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error(err.message || "Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <>
      <Toaster position="bottom-right" />
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg flex overflow-hidden">
                <div className="w-full lg:w-1/2 p-8 md:p-12">
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <Image src="/logo.png" alt="Zando Logo" width={150} height={50} />
                    </Link>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">Create New Password</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                    Your new password must be different from previous used passwords.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Input
                            label="New Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
                        >
                            {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            label="Confirm Password"
                            name="confirm"
                            type={showConfirm ? "text" : "password"}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-9 text-gray-500 dark:text-gray-400"
                        >
                            {showConfirm ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                        </button>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:bg-gray-400">
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
                </div>
                <div className="hidden lg:block w-1/2 relative">
                    <Image src="/ban3.jpg" alt="Fashion model" layout="fill" objectFit="cover" />
                </div>
            </div>
        </div>
    </>
  );
}