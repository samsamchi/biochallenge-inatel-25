import { dosages } from "@/app/services/units";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  return NextResponse.json(dosages, { status: 200 });
}
