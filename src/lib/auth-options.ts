import CredentialsProvider from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import { AuthOptions } from 'next-auth';
import mongoose from 'mongoose';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await connectToDatabase();
        
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        
        if (!user) {
          throw new Error('No user found with this email');
        }
        
        const isPasswordValid = await user.comparePassword(credentials.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        
        // Use type assertion to handle MongoDB document
        const userDoc = user as unknown as { 
          _id: mongoose.Types.ObjectId;
          email: string;
          name?: string;
          image?: string;
        };
        
        return {
          id: userDoc._id.toString(),
          email: userDoc.email,
          name: userDoc.name || userDoc.email.split('@')[0],
          image: userDoc.image,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 