// src/app/api/medicines/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.medicine.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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

    const medicine = await prisma.medicine.update({
      where: { id: params.id },
      data: {
        name,
        unit,
        frequency,
        dosage,
        start: new Date(start),
        end: end ? new Date(end) : null,
        description,
      },
    });

    return NextResponse.json(medicine);
  } catch (error) {
    console.error("Erro ao atualizar medicamento:", error);
    return NextResponse.json(
      { message: "Erro ao atualizar medicamento" },
      { status: 500 },
    );
  }
}
