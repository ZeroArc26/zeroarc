import NextAuth from "next-auth";

import authConfig from "./auth.config";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }

      return session;
    },
  },
});