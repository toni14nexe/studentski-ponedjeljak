import { NextResponse } from "next/server";
import prisma from "@/app/api/prisma-client";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ok",
      message: "Database connection is alive",
      time: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
