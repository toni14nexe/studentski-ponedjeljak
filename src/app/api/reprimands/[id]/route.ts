import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Reprimand } from "@/types/reprimand";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const reprimand = await prisma.reprimand.findUnique({
    where: { id: Number(id) },
  });

  if (!reprimand) {
    return NextResponse.json({ error: "Reprimand not found" }, { status: 404 });
  }

  return NextResponse.json(reprimand);
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const reprimand: Partial<Reprimand> = await request.json();

  try {
    const updatedReprimand = await prisma.reprimand.update({
      where: { id: Number(id) },
      data: reprimand,
    });

    return NextResponse.json(updatedReprimand, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Reprimand not found or update failed" },
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

  const response = await prisma.reprimand.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(response);
}
