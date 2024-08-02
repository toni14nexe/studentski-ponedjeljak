import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import { Reprimand } from "@/types/reprimand";

export async function GET() {
  const reprimands = await prisma.reprimand.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(reprimands);
}

export async function POST(request: Request) {
  const { fullname, note }: Reprimand = await request.json();
  const newReprimand = await prisma.reprimand.create({
    data: {
      fullname,
      note,
    },
  });
  return NextResponse.json(newReprimand, { status: 201 });
}
