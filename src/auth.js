import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      authorize: async (credentials) => {

        if (credentials === null) {
          throw new Error("Invalid credentials");
        }

        if (credentials.type === "user") {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          return { id: user.id, email: user.email, role: user.role, type: "user", tenantId: user.tenantId };
        
        } else if (credentials.type === "client") {
          const client = await prisma.client.findUnique({
            where: { email: credentials.email },
          });

          if (!client || !client.password) {
            throw new Error("Invalid credentials");
          }

          const isValidPassword = await bcrypt.compare(credentials.password, client.password);
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          return { id: client.id, email: client.email, role: "CLIENT", type: "client" };
        }

        throw new Error("Unknown login type");
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.type = user.type;
        token.tenantId = user.tenantId || null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = token.role;
        session.user.type = token.type;
        session.user.tenantId = token.tenantId || null;
      }
      return session;
    },
  },
});