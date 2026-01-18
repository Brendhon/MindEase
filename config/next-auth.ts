/**
 * NextAuth Configuration - MindEase
 * NextAuth configuration with Firebase as authentication provider
 */
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

/**
 * NextAuth configuration
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    /**
     * JWT callback - runs whenever a JWT is created or updated
     */
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.accessToken = account.access_token;
        // Use email as ID if user.id is not available
        token.id = user.id || user.email || '';
        token.email = user.email || '';
      }
      return token;
    },
    /**
     * Session callback - returns session data to client
     */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || (token.email as string) || '';
        session.user.email = (token.email as string) || '';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
