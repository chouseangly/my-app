'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import InputForForgotPassword from "../../../components/ui/inputForForgetPassword";
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Sending OTP...");

    try {
      const url = `${API_BASE_URL}/auths/forgot-password?email=${encodeURIComponent(email)}`;
      const res = await fetch(url, {
        method: "POST",
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Failed to send reset email.");
      }
      
      toast.success(text || "Password reset email sent successfully!", { id: toastId });
      router.push(`/verify-forgotpassword?email=${encodeURIComponent(email)}`);

    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">Forgot Your Password?</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
              Enter your email and we'll send you a code to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FiMail className="absolute left-3 top-10 text-gray-400" />
                <InputForForgotPassword
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10" // Add padding for the icon
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "Send Code"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link href="/login" className="text-black dark:text-white font-semibold hover:underline">
                Log in
              </Link>
            </p>
        </div>
        <div className="hidden lg:block w-1/2 relative">
            <Image src="/ban1.jpg" alt="Fashion model" layout="fill" objectFit="cover" />
        </div>
      </div>
    </div>
  );
}