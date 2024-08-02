import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Law } from "@/types/law";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const law = await prisma.law.findUnique({
    where: { id: Number(id) },
  });

  if (!law) {
    return NextResponse.json({ error: "Law not found" }, { status: 404 });
  }

  return NextResponse.json(law);
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const law: Partial<Law> = await request.json();

  try {
    const updatedLaw = await prisma.law.update({
      where: { id: Number(id) },
      data: law,
    });

    return NextResponse.json(updatedLaw, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Law not found or update failed" },
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

  const response = await prisma.law.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json(response);
}
