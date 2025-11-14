"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle, Key } from "lucide-react";

// Validation schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid
  const [tokenChecked, setTokenChecked] = useState(false);

  // Check if token is valid on page load
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenValid(false);
        setTokenChecked(true);
        setErrors({ submit: "Invalid or missing reset token" });
        return;
      }

      try {
        console.log("🔍 Checking token validity:", token);
        const res = await fetch(`/api/auth/verify-reset-token?token=${token}`);
        const data = await res.json();

        console.log("🔍 Token check response:", data);

        if (!res.ok) {
          setTokenValid(false);
          setErrors({ submit: data.error || "Invalid or expired reset token" });
        } else {
          setTokenValid(true);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        setErrors({ submit: "Failed to verify reset token" });
      } finally {
        setTokenChecked(true);
      }
    };

    checkToken();
  }, [token]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        if (error.issues && Array.isArray(error.issues)) {
          error.issues.forEach(issue => {
            if (issue.path && issue.path[0]) {
              newErrors[issue.path[0]] = issue.message;
            }
          });
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
    if (password.match(/\d/)) strength += 1;
    if (password.match(/[^a-zA-Z\d]/)) strength += 1;

    const strengths = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" }
    ];

    return strengths[Math.min(strength, 4)];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      console.log("🔄 Resetting password with token:", token);
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await res.json();
      console.log("📨 Reset password response:", data);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setErrors({ submit: "Password reset successful! Redirecting to login..." });
      
      // Redirect to login after delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err) {
      console.error('Reset password error:', err);
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking token
  if (!tokenChecked) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3 sm:mb-4"></div>
          <p className="text-base sm:text-lg font-medium text-gray-700">Verifying reset token...</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Please wait while we check your reset link</p>
        </div>
      </main>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
        <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 mx-2 sm:mx-0">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <AlertCircle className="h-5 w-5 sm:h-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              {errors.submit || "This password reset link is invalid or has expired."}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
              Password reset links expire after 1 hour for security reasons.
            </p>
            <a
              href="/auth/login"
              className="inline-block px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              Request New Link
            </a>
            <div className="mt-4 sm:mt-6">
              <a
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
              >
                ← Back to Login
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
      <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 mx-2 sm:mx-0">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Key className="h-5 w-5 sm:h-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Create your new password below</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className={`flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl ${
              errors.submit.includes("successful") 
                ? "bg-green-50 border border-green-200" 
                : "bg-red-50 border border-red-200"
            }`}>
              {errors.submit.includes("successful") ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
              )}
              <p className={errors.submit.includes("successful") ? "text-green-700 text-xs sm:text-sm flex-1" : "text-red-700 text-xs sm:text-sm flex-1"}>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-blue-900 mb-1.5 sm:mb-2">Password Requirements</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                One uppercase letter (A-Z)
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                One lowercase letter (a-z)
              </li>
              <li className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                One number (0-9)
              </li>
            </ul>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Password strength:</span>
                  <span className={`font-medium ${
                    passwordStrength.label === "Strong" ? "text-green-600" :
                    passwordStrength.label === "Good" ? "text-blue-600" :
                    passwordStrength.label === "Fair" ? "text-yellow-600" :
                    passwordStrength.label === "Weak" ? "text-orange-600" : "text-red-600"
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-red-600 text-xs sm:text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs sm:text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm sm:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-colors"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}