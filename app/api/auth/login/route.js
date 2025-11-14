import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators/auth";
import { createToken } from "@/lib/jwt";

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        // - ADD AWAIT HERE - createToken is now async
        const token = await createToken(user);

        const response = NextResponse.json({
            message: "Login successful",
            user: { id: user._id, username: user.username, email: user.email },
        });

        // Set the cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        console.log("- Login successful, token set for:", user.email);
        return response;
    } catch (error) {
        console.error("Login Error:", error);
        if (error.name === "ZodError") {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}