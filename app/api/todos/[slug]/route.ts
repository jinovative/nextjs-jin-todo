import { NextRequest, NextResponse } from "next/server";
import { fetchATodo, deleteATodo, editATodo } from "@/data/firestore";

//search single TODO
export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const fetchedTodo = await fetchATodo(params.slug);

    if (!fetchedTodo) {
        return new Response(null, { status: 204 });
    }

    const response = {
        message: "BRING TODO LIST",
        data: fetchedTodo,
    };
    return NextResponse.json(response, { status: 200 });
}

//remove single TODO
export async function DELETE(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    const deletedTodo = await deleteATodo(params.slug);

    if (!deletedTodo) {
        return new Response(null, { status: 204 });
    }

    const response = {
        message: "Successfully Deleted!",
        data: deletedTodo,
    };
    return NextResponse.json(response, { status: 200 });
}

//edit single TODO id
export async function POST(
    request: NextRequest,

    { params }: { params: { slug: string } }
) {
    const { title, is_done } = await request.json();

    const editedTodo = await editATodo(params.slug, { title, is_done });

    if (editedTodo === null) {
        return new Response(null, { status: 204 });
    }

    const response = {
        message: "Successfully Edited!",
        data: editedTodo,
    };
    return NextResponse.json(response, { status: 200 });
}
