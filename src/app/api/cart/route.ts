import { Cart, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.split("token=")[1];

  if (!token) {
    return NextResponse.json({
      message: "Token not found",
    });
  }

  try {
    const { id } = jwt.verify(token, "teste") as { id: string };

    const cart = await prisma.cart.findFirst({
      where: {
        userId: id,
      },
      include: {
        CartItem: {
          include: {
            Product: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({
        CartItem: [],
        total: 0,
      });
    }

    if (cart.CartItem.length === 0) {
      return NextResponse.json({
        CartItem: [],
        total: 0,
      });
    }
    function calculateCartTotal(cart: Cart & { CartItem: any[] }) {
      return cart.CartItem.reduce((acc, item) => {
        return acc + item.Product.price * item.quantity;
      }, 0);
    }

    return NextResponse.json({
      ...cart,
      total: calculateCartTotal(cart),
    });
  } catch (err) {
    return NextResponse.json({
      message: "Token invalid",
      err,
    });
  }
}

export async function PUT(request: Request) {
  const id = request.url.split("?id=")[1];
  const { quantity } = await request.json();

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id,
    },
  });

  if (!cartItem) {
    return NextResponse.json({
      message: "Item not found",
    });
  }

  await prisma.product.update({
    where: {
      id: cartItem.productId,
    },
    data: {
      quantityAvailable: {
        increment: cartItem.quantity - quantity,
      },
    },
  });

  await prisma.cartItem.update({
    where: {
      id: cartItem.id,
    },
    data: {
      quantity: quantity,
    },
  });

  return NextResponse.json({
    message: "Item updated",
  });
}

export async function DELETE(request: Request) {
  const id = request.url.split("?id=")[1];
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      id,
    },
  });

  if (!cartItem) {
    return NextResponse.json({
      message: "Item not found",
    });
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItem.id,
    },
  });

  await prisma.product.update({
    where: {
      id: cartItem.productId,
    },
    data: {
      quantityAvailable: {
        increment: cartItem.quantity,
      },
    },
  });

  return NextResponse.json(cartItem);
}
