import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // If user doesn't exist, still return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with that email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate password reset token
    const resetToken = await user.generatePasswordResetToken();

    // Generate email content
    const { html, text } = generatePasswordResetEmail(user.email, resetToken);

    // Send email
    const emailSent = await sendEmail({
      to: user.email,
      subject: 'Reset Your Password - Bulletin App',
      htmlContent: html,
      textContent: text,
    });

    if (!emailSent) {
      return NextResponse.json(
        { message: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account exists with that email, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 