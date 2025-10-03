"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/ui/Input"; // Re-using your Input component
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RegisterPage() {
  const router = useRouter();
  const { status } = useSession();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (Your validation and registration logic is fine, no changes needed here)
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auths/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            password: form.password
        }),
      });
      
      if (response.ok) {
        router.push(`/verifyOtp?email=${form.email}`);
      } else {
        const resultText = await response.text();
        setApiError(resultText || "Registration failed. This email may already be in use.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setApiError("Could not connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  useEffect(() => {
    // MODIFIED: No more localStorage! Just redirect if the user is already logged in.
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg flex overflow-hidden">
        <div className="w-full lg:w-1/2 p-8 md:p-12">
            <div className="flex justify-center mb-6">
                <Link href="/">
                    <Image src="/logo.png" alt="Zando Logo" width={150} height={50} />
                </Link>
            </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">Create an Account</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Join the Zando community today!</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" error={errors.firstName} />
              </div>
              <div className="w-full sm:w-1/2">
                <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" error={errors.lastName} />
              </div>
            </div>

            <div>
              <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} />
            </div>

            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" error={errors.password} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-9 right-3 text-gray-500">
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            
            <div className="relative">
              <Input label="Confirm Password" type={showConfirm ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" error={errors.confirmPassword} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute top-9 right-3 text-gray-500">
                {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            
            {apiError && <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">{apiError}</p>}
            
            <button type="submit" disabled={loading} className="w-full py-3 bg-black text-white rounded-md font-semibold hover:bg-gray-800 transition disabled:bg-gray-400">
              {loading ? "Registering..." : "Create Account"}
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
            Already have an account?{" "}
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