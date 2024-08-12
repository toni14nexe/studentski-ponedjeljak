import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Member } from "@/types/member";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fullname = url.searchParams.get("username") || undefined;

  if (fullname) {
    const member = await prisma.member.findFirst({
      orderBy: { fullname: "asc" },
      where: { fullname },
    });
    return NextResponse.json(member);
  }

  const members = await prisma.member.findMany({
    orderBy: { fullname: "asc" },
  });
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const { fullname, birthday, associated }: Member = await request.json();
  const newMember = await prisma.member.create({
    data: {
      fullname,
      birthday,
      associated,
    },
  });
  return NextResponse.json(newMember, { status: 201 });
}
