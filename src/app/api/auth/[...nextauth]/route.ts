import NextAuth from "next-auth";
import { SessionStrategy } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

// 🔹 Defina authOptions separadamente
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user) throw new Error("Usuário não encontrado");

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Senha incorreta");

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" as SessionStrategy },
  pages: { signIn: "/login" },
};

// 🔹 Handler do NextAuth usando as opções
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
