import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const userEmail = req.headers.get("X-User-Email");

    if (!userEmail) {
      return NextResponse.json(
        { message: "Autenticação necessária" },
        { status: 401 },
      );
    }

    const { name, dosage, start, end, description, unit, frequency } =
      await req.json();

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        name,
        unit,
        frequency,
        dosage,
        start: new Date(start),
        end: end ? new Date(end) : null,
        description,
        userId: user.id,
      },
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return NextResponse.json(
      { message: "Erro ao cadastrar medicamento" },
      { status: 500 },
    );
  }
}

// Adicione este novo método para listagem
export async function GET(req: NextRequest) {
  try {
    const userEmail = req.headers.get("X-User-Email");

    if (!userEmail) {
      return NextResponse.json(
        { message: "Autenticação necessária" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const medicines = await prisma.medicine.findMany({
      where: { userId: user.id },
      // orderBy: { updatedAt: "asc" }, // Deverá ordenar por próxima administração mais próxima
    });

    return NextResponse.json(medicines);
  } catch (error) {
    console.error("Erro ao buscar medicamentos:", error);
    return NextResponse.json(
      { message: "Erro ao buscar medicamentos" },
      { status: 500 },
    );
  }
}
