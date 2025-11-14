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
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Verifying reset token...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we check your reset link</p>
        </div>
      </main>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
            <p className="text-gray-600 mb-4">
              {errors.submit || "This password reset link is invalid or has expired."}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Password reset links expire after 1 hour for security reasons.
            </p>
            <a
              href="/auth/login"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium"
            >
              Request New Link
            </a>
            <div className="mt-6">
              <a
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-gray-600 mt-2">Create your new password below</p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Error Message */}
          {errors.submit && (
            <div className={`flex items-center gap-3 p-4 rounded-xl ${
              errors.submit.includes("successful") 
                ? "bg-green-50 border border-green-200" 
                : "bg-red-50 border border-red-200"
            }`}>
              {errors.submit.includes("successful") ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              )}
              <p className={errors.submit.includes("successful") ? "text-green-700 text-sm" : "text-red-700 text-sm"}>
                {errors.submit}
              </p>
            </div>
          )}

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Password Requirements</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                One uppercase letter (A-Z)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                One lowercase letter (a-z)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                One number (0-9)
              </li>
            </ul>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
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
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Confirm your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
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