import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import { Reprimand } from "@/types/reprimand";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fullname = url.searchParams.get("memberFullname") || undefined;

  if (fullname) {
    const reprimands = await prisma.reprimand.findMany({
      orderBy: { id: "desc" },
      where: { fullname },
    });
    return NextResponse.json(reprimands);
  }

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
