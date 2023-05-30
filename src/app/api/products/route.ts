import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const page = request.url.split("?page=")[1];
  const category = request.url.split("filter=")[1];
  const search = request.url.split("search=")[1];
  const cleanCategory = category?.replaceAll("%20", " ");
  const numberPage = Number(page);

  const products = await prisma.product.findMany({
    where: {
      category: cleanCategory || undefined,
      name: {
        contains: search || undefined,
        mode: "insensitive",
      },
    },
    include: {
      User: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: numberPage ? (numberPage - 1) * 21 : 0,
    take: 21,
  });

  const count = await prisma.product.count({
    where: {
      category: cleanCategory || undefined,
      name: {
        contains: search || undefined,
      },
    },
  });

  return NextResponse.json({
    products,
    pages: Math.ceil(count / 21),
    category: cleanCategory || "all",
    request: request.url,
  });
}

export async function POST(request: Request) {
  const { name, description, price, quantityAvailable, category, image } =
    await request.json();
  const token = request.headers.get("cookie")?.split("token=")[1];

  if (!token) {
    return NextResponse.json({
      message: "Token not found",
    });
  }

  try {
    const { id } = jwt.verify(token, "teste") as { id: string };
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantityAvailable,
        category: category
          .replaceAll("%20", " ")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
        image:
          image ||
          "https://firebasestorage.googleapis.com/v0/b/genesis-ecomm.appspot.com/o/images%2Fdefault_image.png?alt=media&token=a9c86f0b-0599-497e-9039-98ea97e59885&_gl=1*fogkw4*_ga*NjkxMjI1MzQ3LjE2ODU0MDIyODc.*_ga_CW55HF8NVT*MTY4NTQwNzQ1My4yLjEuMTY4NTQwNzUyNi4wLjAuMA..",
        User: {
          connect: {
            id,
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}

export async function PUT(request: Request) {
  const name = request.url.split("?name=")[1];
  const token = request.headers.get("cookie")?.split("token=")[1];

  if (!token) {
    return NextResponse.json({
      message: "Token not found",
    });
  }

  try {
    const { id } = jwt.verify(token, "teste") as { id: string };
    const { description, price, category, image, quantityAvailable, newName } =
      await request.json();
    const product = await prisma.product.findFirstOrThrow({
      where: {
        name: name.replaceAll("%20", " "),
        userId: id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" });
    }

    const product_update = await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        name: newName,
        description,
        price,
        category,
        image:
          image ||
          "https://firebasestorage.googleapis.com/v0/b/genesis-ecomm.appspot.com/o/images%2Fdefault_image.png?alt=media&token=a9c86f0b-0599-497e-9039-98ea97e59885&_gl=1*fogkw4*_ga*NjkxMjI1MzQ3LjE2ODU0MDIyODc.*_ga_CW55HF8NVT*MTY4NTQwNzQ1My4yLjEuMTY4NTQwNzUyNi4wLjAuMA..",
        quantityAvailable,
      },
    });

    return NextResponse.json({
      message: "Product updated",
      product_update,
    });
  } catch (err) {
    return NextResponse.json({
      message: "Token invalid",
      err,
    });
  }
}

export async function DELETE(request: Request) {
  const name = request.url.split("?name=")[1];
  const token = request.headers.get("cookie")?.split("token=")[1];

  if (!token) {
    return NextResponse.json({
      message: "Token not found",
    });
  }

  try {
    const { id } = jwt.verify(token, "teste") as { id: string };
    const product = await prisma.product.findFirstOrThrow({
      where: {
        name: name.replaceAll("%20", " "),
        userId: id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" });
    }

    const product_delete = await prisma.product.delete({
      where: {
        id: product.id,
      },
    });

    return NextResponse.json(product_delete);
  } catch (err) {
    return NextResponse.json({
      message: "Token invalid",
      err,
    });
  }
}
