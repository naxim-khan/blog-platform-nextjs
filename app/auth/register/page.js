"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";

const registerSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function RegisterPage() {
    const router = useRouter();
    const { user, loading: authLoading, register } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Only redirect if user is already logged in
    useEffect(() => {
        if (user && !authLoading) {
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
            registerSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                // CORRECTED: Use error.issues instead of error.errors
                if (error.issues && Array.isArray(error.issues)) {
                    error.issues.forEach(issue => {
                        if (issue.path && issue.path[0]) {
                            newErrors[issue.path[0]] = issue.message;
                        }
                    });
                } else {
                    console.error('Unexpected Zod error structure:', error);
                    newErrors.submit = 'Validation failed';
                }
                setErrors(newErrors);
            } else {
                console.error('Unexpected error during validation:', error);
                setErrors({ submit: 'An unexpected error occurred' });
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

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});

        console.log("🔄 Register button clicked");
        console.log("📝 Form data:", formData);

        if (!validateForm()) {
            console.log("- Form validation failed");
            return;
        }

        setLoading(true);
        console.log("🔄 Starting registration...");

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            console.log("📨 API Response status:", res.status);
            const data = await res.json();
            console.log("📨 API Response data:", data);

            if (!res.ok) {
                console.log("- API returned error");
                // Handle validation errors from server
                if (data.error) {
                    // If it's a Zod error array
                    if (Array.isArray(data.error)) {
                        const newErrors = {};
                        data.error.forEach(error => {
                            if (error.path && error.path[0]) {
                                newErrors[error.path[0]] = error.message;
                            }
                        });
                        setErrors(newErrors);
                    } else {
                        // If it's a simple error message
                        setErrors({ submit: data.error });
                    }
                } else {
                    setErrors({ submit: 'Registration failed' });
                }
                return;
            }

            // Registration successful
            console.log('- Registration success');
            setErrors({ submit: "Registration successful! Redirecting to login..." });

            // Redirect to login after delay
            setTimeout(() => {
                router.push('/auth/login');
            }, 2000);

        } catch (err) {
            console.error('Registration error:', err);
            setErrors({ submit: 'Registration failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-gray-600 mt-2">Sign up to get started</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    {/* Error Message */}
                    {errors.submit && (
                        <div className={`flex items-center gap-3 p-4 rounded-xl ${errors.submit.includes("successful")
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

                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleChange('username', e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Choose a username"
                            />
                        </div>
                        {errors.username && (
                            <p className="text-red-600 text-sm flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-600 text-sm flex items-center gap-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Create a password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600">Password strength:</span>
                                    <span className={`font-medium ${passwordStrength.label === "Strong" ? "text-green-600" :
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
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Creating account...
                            </div>
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <a
                            href="/auth/login"
                            className="text-blue-600 hover:text-blue-700 font-semibold underline-offset-2 hover:underline transition-colors"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}