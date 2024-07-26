import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Assembly } from "@/types/assembly";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || "1");
  const perPage = Number(url.searchParams.get("perPage") || "5");

  const offset = (page - 1) * perPage;

  const totalCount = await prisma.assembly.count();
  const totalPages = Math.ceil(totalCount / perPage);

  const assemblies = await prisma.assembly.findMany({
    orderBy: { date: "desc" },
    skip: offset,
    take: perPage,
  });
  return NextResponse.json({ assemblies, totalPages });
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
