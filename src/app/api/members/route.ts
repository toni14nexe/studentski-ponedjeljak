import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";
import type { Member } from "@/types/member";

export async function GET() {
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
