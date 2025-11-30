import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-client";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        // Define a simple User schema if it doesn't exist
        const UserSchema = new mongoose.Schema({
          email: { type: String, required: true, unique: true },
          password: { type: String, required: true },
          name: { type: String },
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model("User", UserSchema);

        const user = await User.findOne({ email: (credentials.email as string).toLowerCase() });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      
      console.log("[Middleware] Path:", pathname, "Auth:", !!auth);
      
      // Public routes
      if (pathname.startsWith('/login') || 
          pathname.startsWith('/signup') || 
          pathname.startsWith('/api/auth')) {
        console.log("[Middleware] Public route, allowing");
        return true;
      }
      
      // All other routes require auth
      const isAuthorized = !!auth;
      console.log("[Middleware] Protected route, authorized:", isAuthorized);
      
      if (!isAuthorized) {
        console.log("[Middleware] Not authorized, will redirect to /login");
      }
      
      return isAuthorized;
    },
  },
});

