"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, Home } from "lucide-react";

// Validation schema
const loginSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: z.string()
        .min(1, "Password is required")
});

export default function LoginPage() {
    const router = useRouter();
    const { user, loading: authLoading, checkAuth } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        console.log("Login page - User:", user, "Loading:", authLoading);

        // Only redirect if user is truthy (not null, not empty object)
        if (user && Object.keys(user).length > 0 && !authLoading) {
            console.log("User already logged in, redirecting to dashboard");
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

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
            loginSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach(err => {
                    if (err.path[0]) {
                        newErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Invalid credentials');
            }

            console.log('- Login success, redirecting...');

            // Use hard redirect to ensure middleware runs
            window.location.href = '/dashboard';

        } catch (err) {
            console.error('Login error:', err);
            setErrors({ submit: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setErrors({ email: "Email is required to reset password" });
            return;
        }

        // Validate email format
        try {
            z.string().email().parse(formData.email);
        } catch {
            setErrors({ email: "Please enter a valid email address" });
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordMessage("");

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setForgotPasswordMessage("Password reset link sent to your email!");
        } catch (err) {
            console.error('Forgot password error:', err);
            setErrors({ submit: err.message });
        } finally {
            setForgotPasswordLoading(false);
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-base sm:text-lg font-medium text-gray-700">Checking authentication...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-3 sm:px-4">
            <div className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 lg:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 mx-2 sm:mx-0">
                {/* Back to Home Button */}
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Homepage</span>
                    </button>
                </div>

                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Lock className="h-5 w-5 sm:h-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                    {/* Error Message */}
                    {errors.submit && (
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <p className="text-red-700 text-xs sm:text-sm flex-1">{errors.submit}</p>
                        </div>
                    )}

                    {/* Success Message for Forgot Password */}
                    {forgotPasswordMessage && (
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl">
                            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <p className="text-green-700 text-xs sm:text-sm flex-1">{forgotPasswordMessage}</p>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-600 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5 sm:space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
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
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showPassword ? 
                                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                                }
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-600 text-xs sm:text-sm flex items-center gap-1">
                                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Forgot Password */}
                    <div className="text-right">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            disabled={forgotPasswordLoading}
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed py-1 px-2 -mr-2"
                        >
                            {forgotPasswordLoading ? "Sending..." : "Forgot your password?"}
                        </button>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-white border-t-transparent"></div>
                                Signing in...
                            </div>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="/auth/register"
                            className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-colors"
                        >
                            Create account
                        </a>
                    </p>
                </div>

                {/* Alternative Back to Home Button at Bottom */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 text-center">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                        <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span>Return to Homepage</span>
                    </button>
                </div>
            </div>
        </main>
    );
}