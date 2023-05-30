import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" });
    }

    if (user.password !== password) {
        return NextResponse.json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, "teste", {
        expiresIn: "7d",
    })

    return NextResponse.json({ token });
}