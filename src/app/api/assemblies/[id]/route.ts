import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Assembly } from "@/types/assembly";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const assembly = await prisma.assembly.findUnique({
    where: { id: Number(id) },
  });

  if (!assembly) {
    return NextResponse.json({ error: "Assembly not found" }, { status: 404 });
  }

  return NextResponse.json(assembly);
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const assembly: Partial<Assembly> = await request.json();

  try {
    const updatedAssembly = await prisma.assembly.update({
      where: { id: Number(id) },
      data: assembly,
    });

    return NextResponse.json(updatedAssembly, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Assembly not found or update failed" },
      { status: 404 }
    );
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const response = await prisma.assembly.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(response);
}
