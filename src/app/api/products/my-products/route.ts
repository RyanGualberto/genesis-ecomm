import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const page = request.url.split("?page=")[1];
  const numberPage = Number(page)
  const token = request.headers.get("cookie")?.split("token=")[1];

  if (!token) {
    return NextResponse.json({
      message: "Token not found"
    });
  }

  try {
    const { id } = jwt.verify(token, "teste") as { id: string };
    const allProducts = await prisma.product.findMany({
      where: {
        userId: id,
      },
    });

    const productsPaginated = await prisma.product.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: (numberPage - 1) * 21,
      take: 21,
    });

    return NextResponse.json({
      products: productsPaginated,
      pages: Math.ceil(allProducts.length / 21),
      totalProducts: allProducts.length,
    });
  } catch (error) {
    NextResponse.json({
      error
    })
  }
}