import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const user = await getToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const userData = await User.findById(user.id).select('-password');
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Get Profile Error:", error);
    return NextResponse.json({ error: "Error fetching profile" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = await getToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, email, bio, website, avatar } = body;

    await connectDB();

    // Check if username or email already exists (excluding current user)
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: user.id } 
      });
      if (existingUser) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    if (email) {
      const existingEmail = await User.findOne({ 
        email, 
        _id: { $ne: user.id } 
      });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
    }

    // Validate avatar URL if provided
    if (avatar) {
      try {
        const url = new URL(avatar);
        // Check if it's a valid HTTP/HTTPS URL
        if (!['http:', 'https:'].includes(url.protocol)) {
          return NextResponse.json({ 
            error: "Avatar URL must be a valid HTTP or HTTPS link" 
          }, { status: 400 });
        }
        // Optional: Check if URL points to an image (basic check)
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasImageExtension = imageExtensions.some(ext => 
          url.pathname.toLowerCase().endsWith(ext)
        );
        if (!hasImageExtension && !url.pathname.includes('/')) {
          return NextResponse.json({ 
            error: "Avatar URL should point to an image file" 
          }, { status: 400 });
        }
      } catch (urlError) {
        return NextResponse.json({ 
          error: "Invalid avatar URL format. Please provide a valid direct image link." 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date()
    };

    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (avatar !== undefined) updateData.avatar = avatar;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: updatedUser 
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}