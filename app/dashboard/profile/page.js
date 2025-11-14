"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Save,
    User,
    Mail,
    Calendar,
    Lock,
    Eye,
    EyeOff,
    Shield,
    CheckCircle,
    Sparkles,
    ImageIcon
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        bio: "",
        website: "",
        avatar: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordErrors, setPasswordErrors] = useState({});
    const [saveMessage, setSaveMessage] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true);
                const res = await fetch('/api/auth/profile');
                
                if (res.ok) {
                    const userData = await res.json();
                    console.log('Fetched user data:', userData);
                    setFormData({
                        username: userData.username || user?.username || "",
                        email: userData.email || user?.email || "",
                        bio: userData.bio || "",
                        website: userData.website || "",
                        avatar: userData.avatar || ""
                    });
                } else {
                    console.warn('API failed, using auth user data');
                    setFormData({
                        username: user?.username || "",
                        email: user?.email || "",
                        bio: user?.bio || "",
                        website: user?.website || "",
                        avatar: user?.avatar || ""
                    });
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setFormData({
                    username: user?.username || "",
                    email: user?.email || "",
                    bio: user?.bio || "",
                    website: user?.website || "",
                    avatar: user?.avatar || ""
                });
            } finally {
                setProfileLoading(false);
            }
        };

        if (user) {
            fetchUserProfile();
        } else {
            setProfileLoading(false);
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSaveMessage("");

        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSaveMessage("Profile updated successfully!");
                if (updateProfile) {
                    updateProfile(data.user);
                }
            } else {
                setSaveMessage(data.error || "Failed to update profile");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setSaveMessage("Error updating profile");
        } finally {
            setLoading(false);
            setTimeout(() => setSaveMessage(""), 3000);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordErrors({});

        const errors = {};
        if (!passwordData.currentPassword) {
            errors.currentPassword = "Current password is required";
        }
        if (!passwordData.newPassword) {
            errors.newPassword = "New password is required";
        } else if (passwordData.newPassword.length < 6) {
            errors.newPassword = "Password must be at least 6 characters";
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(errors).length > 0) {
            setPasswordErrors(errors);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSaveMessage("Password changed successfully!");
                setPasswordDialogOpen(false);
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            } else {
                setPasswordErrors({ submit: data.error || "Failed to change password" });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordErrors({ submit: "Error changing password" });
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSaveMessage("");
                setPasswordErrors({});
            }, 3000);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: "", color: "bg-slate-200 dark:bg-slate-700" };

        let strength = 0;
        if (password.length >= 6) strength += 1;
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

    const passwordStrength = getPasswordStrength(passwordData.newPassword);

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-slate-900 dark:text-white">Loading profile</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Getting your information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-5 px-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center shadow-sm">
                            <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Profile Settings
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage your account settings and preferences
                            </p>
                        </div>
                    </div>
                </div>

                {saveMessage && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${saveMessage.includes("successfully")
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                        }`}>
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{saveMessage}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl h-full">
                        <CardHeader className="pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Update your personal information and how others see you on the platform.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="username" className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => handleChange('username', e.target.value)}
                                        placeholder="Enter your username"
                                        className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="Enter your email"
                                        className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="bio" className="text-sm font-medium text-slate-700 dark:text-slate-300">Bio</Label>
                                <Input
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => handleChange('bio', e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    A brief description of yourself shown on your profile
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label htmlFor="website" className="text-sm font-medium text-slate-700 dark:text-slate-300">Website</Label>
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => handleChange('website', e.target.value)}
                                        placeholder="https://example.com"
                                        className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="avatar" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        Avatar URL
                                    </Label>
                                    <Input
                                        id="avatar"
                                        value={formData.avatar}
                                        onChange={(e) => handleChange('avatar', e.target.value)}
                                        placeholder="https://i.postimg.cc/..."
                                        className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-xl"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Direct image link only (e.g., https://i.postimg.cc/...)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="h-20 w-20 border-2 border-white dark:border-slate-800 shadow-sm">
                                    <AvatarImage src={formData.avatar || user?.avatar} />
                                    <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white font-semibold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {user?.username}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{user?.email}</p>
                                </div>
                                <div className="w-full space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                        <span className="flex items-center">
                                            <User className="h-4 w-4 mr-2" />
                                            Member since
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">{new Date().getFullYear()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Last active
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-white">Just now</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl">
                        <CardContent className="p-6 space-y-4">
                            <Button
                                onClick={handleProfileSubmit}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white rounded-xl py-2.5 shadow-sm"
                                disabled={loading}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>

                            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl py-2.5">
                                        <Lock className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                                    <DialogHeader>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Change Password</DialogTitle>
                                                <DialogDescription className="text-slate-600 dark:text-slate-400">
                                                    Update your password to keep your account secure
                                                </DialogDescription>
                                            </div>
                                        </div>
                                    </DialogHeader>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        <div className="space-y-3">
                                            <Label htmlFor="currentPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showCurrentPassword ? "text" : "password"}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                    placeholder="Enter current password"
                                                    className={`pr-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${passwordErrors.currentPassword ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500" : "border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                                                        }`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordErrors.currentPassword && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.currentPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="newPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                    placeholder="Enter new password"
                                                    className={`pr-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${passwordErrors.newPassword ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500" : "border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                                                        }`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    )}
                                                </Button>
                                            </div>

                                            {passwordData.newPassword && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-600 dark:text-slate-400">Password strength:</span>
                                                        <span className={`font-medium ${passwordStrength.label === "Strong" ? "text-green-600 dark:text-green-400" :
                                                            passwordStrength.label === "Good" ? "text-blue-600 dark:text-blue-400" :
                                                                passwordStrength.label === "Fair" ? "text-yellow-600 dark:text-yellow-400" :
                                                                    passwordStrength.label === "Weak" ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"
                                                            }`}>
                                                            {passwordStrength.label}
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-300 ${passwordData.newPassword ? passwordStrength.color : "bg-slate-200 dark:bg-slate-700"
                                                                }`}
                                                            style={{
                                                                width: `${(passwordStrength.strength + 1) * 20}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {passwordErrors.newPassword && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.newPassword}</p>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                    placeholder="Confirm new password"
                                                    className={`pr-10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${passwordErrors.confirmPassword ? "border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-500" : "border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                                                        }`}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                                    )}
                                                </Button>
                                            </div>
                                            {passwordErrors.confirmPassword && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.confirmPassword}</p>
                                            )}
                                        </div>

                                        {passwordErrors.submit && (
                                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                <p className="text-sm text-red-600 dark:text-red-400">{passwordErrors.submit}</p>
                                            </div>
                                        )}

                                        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setPasswordDialogOpen(false)}
                                                className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-700 dark:hover:to-green-800 text-white"
                                            >
                                                {loading ? "Updating..." : "Update Password"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Security Tips */}
            <Card className="border min-w-full border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Security Tips</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>Use a strong, unique password</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>Update your password regularly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span>Never share your password</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}