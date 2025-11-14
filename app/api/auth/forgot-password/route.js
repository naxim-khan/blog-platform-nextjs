import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { forgotPasswordLimiter, getClientIP, applyRateLimit } from '@/lib/rateLimit';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate email
    const validatedData = emailSchema.parse(body);
    const { email } = validatedData;

    // Apply rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = await applyRateLimit(forgotPasswordLimiter, `forgot-password:${clientIP}:${email}`);

    if (rateLimitResult.isRateLimited) {
      return NextResponse.json(
        { 
          error: "Too many password reset attempts. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
        },
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

    // Connect to database
    await connectDB();

    // Check if user exists using Mongoose User model
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Store reset token in database using Mongoose
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'https://blog-platform-nextjs-orpin.vercel.app/'}/auth/reset-password?token=${resetToken}`;

    // Send email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your account.</p>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Reset Password
          </a>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br />
            ${resetUrl}
          </p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}