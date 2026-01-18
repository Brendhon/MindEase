/**
 * NextAuth API Route Handler - MindEase
 * Handles all NextAuth authentication requests
 */
import NextAuth from 'next-auth';
import { authOptions } from '@/config/next-auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
