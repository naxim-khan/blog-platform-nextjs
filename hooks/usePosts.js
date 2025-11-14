// Fetch & cache posts
"use client";
import { useState, useEffect, useCallback } from 'react';

export function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);

    // Fetch all posts
    const fetchPosts = useCallback(async (page = 1, limit = 12) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/posts?page=${page}&limit=${limit}`, {
                credentials: 'include'
            });
            
            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }
            
            const data = await res.json();
            setPosts(data.posts);
            setPagination(data.pagination);
            return data;
        } catch (err) {
            setError(err.message);
            console.error('Fetch posts error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch single post by ID
    const fetchPostById = useCallback(async (id) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/posts/${id}`, {
                credentials: 'include'
            });
            
            if (!res.ok) {
                throw new Error('Failed to fetch post');
            }
            
            const post = await res.json();
            return post;
        } catch (err) {
            setError(err.message);
            console.error('Fetch post error:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Create new post
    const createPost = useCallback(async (postData) => {
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
                credentials: 'include'
            });
            
            if (!res.ok) {
                throw new Error('Failed to create post');
            }
            
            const data = await res.json();
            return { success: true, data };
        } catch (err) {
            console.error('Create post error:', err);
            return { success: false, error: err.message };
        }
    }, []);

    // Update post
    const updatePost = useCallback(async (id, postData) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
                credentials: 'include'
            });
            
            if (!res.ok) {
                throw new Error('Failed to update post');
            }
            
            const data = await res.json();
            return { success: true, data };
        } catch (err) {
            console.error('Update post error:', err);
            return { success: false, error: err.message };
        }
    }, []);

    // Delete post
    const deletePost = useCallback(async (id) => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            if (!res.ok) {
                throw new Error('Failed to delete post');
            }
            
            return { success: true };
        } catch (err) {
            console.error('Delete post error:', err);
            return { success: false, error: err.message };
        }
    }, []);

    // Clear cache
    const clearCache = useCallback(() => {
        setPosts([]);
        setPagination(null);
    }, []);

    return {
        posts,
        loading,
        error,
        pagination,
        fetchPosts,
        fetchPostById,
        createPost,
        updatePost,
        deletePost,
        clearCache
    };
}