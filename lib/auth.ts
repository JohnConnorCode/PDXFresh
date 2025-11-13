import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from './prisma';
import type { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    // Email magic link provider (recommended for production)
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),

    // Credentials provider (for development/testing)
    // In production, you should use email magic links or OAuth providers
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        // In development, auto-create user for any email
        // In production, implement proper authentication
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session?.user) {
        // Add user ID and Stripe customer ID to session
        if (user) {
          session.user.id = user.id;
          session.user.stripeCustomerId = user.stripeCustomerId;
        } else if (token) {
          session.user.id = token.sub!;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.stripeCustomerId = user.stripeCustomerId;
      }
      return token;
    },
  },
  events: {
    createUser: async ({ user }) => {
      // You can add custom logic here when a user is created
      console.log(`New user created: ${user.email}`);
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      stripeCustomerId?: string | null;
    };
  }

  interface User {
    stripeCustomerId?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    stripeCustomerId?: string | null;
  }
}
