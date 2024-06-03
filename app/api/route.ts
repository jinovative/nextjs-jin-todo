import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const response = {
        message: "Hello",
        data: "World",
    };
    return NextResponse.json(response, { status: 201 });
}
