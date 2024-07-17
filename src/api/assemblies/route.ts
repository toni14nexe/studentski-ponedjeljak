import { NextResponse } from "next/server";
import prisma from "@/api/prisma-client";
import type { Assembly } from "@/types/assembly";

export async function GET() {
  const assemblies = await prisma.assembly.findMany();
  return NextResponse.json(assemblies);
}

export async function POST(request: Request) {
  const { date, pregnant, note, members }: Assembly = await request.json();
  const newAssembly = await prisma.assembly.create({
    data: {
      date,
      pregnant,
      note,
      members: JSON.stringify(members),
    },
  });
  return NextResponse.json(newAssembly, { status: 201 });
}
