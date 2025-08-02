// app/api/recuperar-senha/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e nova senha são obrigatórios." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Senha atualizada com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
