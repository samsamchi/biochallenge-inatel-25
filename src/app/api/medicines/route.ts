import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Verifica o header de autenticação simplificado
    const userEmail = req.headers.get("X-User-Email");
    
    if (!userEmail) {
      return NextResponse.json(
        { message: "Autenticação necessária" },
        { status: 401 }
      );
    }

    const { name, dosage, time, description } = await req.json();

    // Encontra o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Cria o medicamento associado ao usuário
    const medicine = await prisma.medicine.create({
      data: {
        name,
        dosage,
        time: new Date(time),
        description,
        userId: user.id,
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return NextResponse.json(
      { message: "Erro ao cadastrar medicamento" },
      { status: 500 }
    );
  }
}