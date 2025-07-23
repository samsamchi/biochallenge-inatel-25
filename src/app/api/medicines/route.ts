// src/app/api/medicines/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId é obrigatório" },
      { status: 400 }
    );
  }

  try {
    const medicines = await prisma.medicine.findMany({
      where: { userId },
      orderBy: { time: "asc" },
    });
    
    return NextResponse.json(medicines);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar medicamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const medicine = await prisma.medicine.create({
      data: {
        name: body.name,
        dosage: body.dosage,
        time: new Date(body.time),
        description: body.description,
        userId: body.userId
      }
    });

    return NextResponse.json(medicine, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar medicamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar medicamento" },
      { status: 500 }
    );
  }
}