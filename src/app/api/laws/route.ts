import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import { Law } from "@/types/law";

export async function GET() {
  const laws = await prisma.law.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(laws);
}

export async function POST(request: Request) {
  const { name, description }: Law = await request.json();
  const newLaw = await prisma.law.create({
    data: {
      name,
      description,
    },
  });
  return NextResponse.json(newLaw, { status: 201 });
}
