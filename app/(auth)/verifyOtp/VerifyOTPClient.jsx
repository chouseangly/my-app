'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VerifyOTPClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error("Email is missing. Redirecting...");
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(paste)) {
      setOtp(paste.split(""));
      document.getElementById(`otp-5`)?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying...");

    try {
      const res = await fetch(`${API_BASE_URL}/auths/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Verification failed. Please try again.");
      }
      
      toast.success("Verification successful! Redirecting to login.", { id: toastId });
      router.push("/login");

    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setIsResending(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const res = await fetch(`${API_BASE_URL}/auths/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to resend OTP.");
      }
      
      toast.success("A new OTP has been sent to your email.", { id: toastId });
      setTimer(60); // Reset timer

    } catch (err) {
      toast.error(err.message || "Failed to resend OTP.", { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Toaster position="bottom-right" />
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg flex overflow-hidden">
        
        <div className="hidden lg:block w-1/2 relative">
          <Image 
            src="/ban2.jpg"
            alt="Verification" 
            layout="fill" 
            objectFit="cover" 
          />
        </div>

        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center">
            <div className="mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">OTP Verification</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 mb-6">
            Enter the 6-digit code sent to <br />
            <span className="font-semibold text-black dark:text-white break-words">{email || "your email"}</span>
          </p>

          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 sm:w-14 sm:h-16 border-b-2 text-center text-2xl font-semibold outline-none focus:border-black dark:focus:border-white transition bg-transparent text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              />
            ))}
          </div>

          <p className="text-sm font-medium mt-4 dark:text-gray-400">
            {timer > 0 ? `Resend code in 00:${String(timer).padStart(2, "0")}` : "OTP Expired"}
          </p>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full mt-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-md font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:bg-gray-400"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Didn’t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="font-semibold text-black dark:text-white hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}