import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const categories = await prisma.product.findMany({
    distinct: ["category"],
    select: {
      category: true,
    },
  });
  
  return NextResponse.json(categories);
}
