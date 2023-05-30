import jwt from "jsonwebtoken"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { token } = await request.json();

    if (!token) {
        return NextResponse.json({
            isValid: false
        });
    }

    try {
        jwt.verify(token, 'teste');
        return NextResponse.json({
            isValid: true
        });
    }
    catch (err) {
        return NextResponse.json({
            isValid: false
        });
    }
}   