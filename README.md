This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up your environment variables:

1. Create a `.env.local` file in the root directory
2. Add the following environment variables:
```
MONGODB_URI=mongodb://localhost:27017/bulletin
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication System

This project includes a complete authentication system using:

- NextAuth.js for authentication
- MongoDB with Mongoose for user data storage
- Email and password authentication

### Features

- User registration and login
- Protected routes
- User profiles
- Session management
- Responsive UI

### Project Structure

- `/src/app/api/auth` - Authentication API routes
- `/src/app/auth` - Authentication pages (signin, signup, error)
- `/src/components/auth` - Authentication components
- `/src/hooks` - Custom hooks including useAuth
- `/src/lib` - Utility functions
- `/src/models` - Mongoose models
- `/src/providers` - React context providers

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
