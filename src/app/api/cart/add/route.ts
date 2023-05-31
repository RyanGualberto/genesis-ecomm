import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const token = request.headers.get("cookie")?.split("token=")[1];

  if (!token) {
    return NextResponse.json({
      message: "Token not found",
    });
  }

  const { id } = jwt.verify(token, "teste") as { id: string };

  let cart = await prisma.cart.findFirst({
    where: {
      userId: id,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: id,
      },
    });
  }

  const { productId, quantity } = await request.json();

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      productId,
      cartId: cart?.id || "",
    },
  });

  if (cartItem) {
    await prisma.cartItem.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity: cartItem.quantity + quantity,
      },
    });

    await decrementProductQuantity(productId, quantity);
  }

  if (!cartItem) {
    await prisma.cartItem.create({
      data: {
        quantity,
        cartId: cart.id,
        productId,
      },
    });

    await decrementProductQuantity(productId, quantity);
  }

  return NextResponse.json({
    message: "Product added to cart",
  });
}

async function decrementProductQuantity(productID: string, quantity: number) {
  return await prisma.product.update({
    where: {
      id: productID,
    },
    data: {
      quantityAvailable: {
        decrement: quantity,
      },
    },
  });
}
