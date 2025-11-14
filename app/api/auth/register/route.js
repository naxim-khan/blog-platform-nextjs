import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators/auth";
import { createToken } from "@/lib/jwt";
import { registerLimiter, getClientIP, applyRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    const body = await req.json();

    // - Validate input
    const { username, email, password } = registerSchema.parse(body);

    // Apply rate limiting
    const clientIP = getClientIP(req);
    const rateLimitResult = await applyRateLimit(registerLimiter, `register:${clientIP}:${email}`);

    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again later." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      );
    }

    await connectDB();

    // - Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // - Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // - Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // - Create token and set cookie
    const token = createToken(newUser);

    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("- Registration successful, token set for:", newUser.email);

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}