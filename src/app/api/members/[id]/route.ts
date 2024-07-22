// src/app/api/members/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Member } from "@/types/member";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
  });

  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json(member);
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const member: Partial<Member> = await request.json();

  try {
    const updatedMember = await prisma.member.update({
      where: { id: Number(id) },
      data: member,
    });

    return NextResponse.json(updatedMember, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Member not found or update failed" },
      { status: 404 }
    );
  }
}
