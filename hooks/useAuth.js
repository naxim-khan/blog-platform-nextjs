"use client";
import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me', {
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                // FIX: Only set user if data.user exists and is not null
                if (data.user) {
                    setUser(data.user);
                    console.log('Auth check: User is authenticated', data.user);
                } else {
                    setUser(null);
                    console.log('Auth check: No user found');
                }
            } else {
                setUser(null);
                console.log('Auth check: No user found');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            
            if (res.ok) {
                await checkAuth(); // Re-check auth status
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            
            const data = await res.json();

            if (res.ok) {
                return { success: true, data };
            } else {
                return { 
                    success: false, 
                    error: data.error || data.details || 'Registration failed' 
                };
            }
        } catch (error) {
            return { success: false, error: 'Registration failed' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { 
                method: 'POST',
                credentials: 'include'
            });
            setUser(null);
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const updateProfile = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return { 
        user, 
        loading, 
        login,
        register,
        logout, 
        checkAuth,
        updateProfile
    };
}