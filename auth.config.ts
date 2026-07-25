import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export default {
  providers: [
    Credentials({
      name: "Admin Login",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const admin = await Admin.findOne({
          email: credentials.email,
        });

        if (!admin) {
          return null;
        }

        if (!admin.isActive) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string,
          admin.password
        );

        if (!isPasswordCorrect) {
          return null;
        }

        admin.lastLogin = new Date();
        await admin.save();

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;