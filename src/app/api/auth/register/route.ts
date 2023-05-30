import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { name, email, password } = await request.json();

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
        },
    });

    return NextResponse.json(user);
}