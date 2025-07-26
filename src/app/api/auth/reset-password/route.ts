import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { token, email, password } = await request.json();

    // Validate input
    if (!token || !email || !password) {
      return NextResponse.json(
        { message: 'Token, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password should be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find the user by email and token
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    // If user not found or token expired
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired password reset token' },
        { status: 400 }
      );
    }

    // Set the new password
    user.password = password;
    
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save the updated user
    await user.save();

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 