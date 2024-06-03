import { NextRequest, NextResponse } from "next/server";
import dummyTodos from "@/data/dummy.json";
import { fetchTodos, addATodo } from "@/data/firestore";

//get every TODO list
export async function GET(request: NextRequest) {
    const fetchedTodos = await fetchTodos();

    const response = {
        message: "load TODOS",
        data: fetchedTodos,
    };
    return NextResponse.json(response, { status: 200 });
}

//add TODO
export async function POST(request: NextRequest) {
    const { title } = await request.json();

    if (title === undefined) {
        const errMessage = {
            message: "Make a Todo title",
        };
        return Response.json(errMessage, { status: 422 });
    }

    const addedTodo = await addATodo({ title });

    const response = {
        message: "Successfully added",
        data: addedTodo,
    };

    return Response.json(response, { status: 201 });
}
