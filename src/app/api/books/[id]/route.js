import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

//  Update a Book
export async function PUT(request, { params }) {
  try {
    // Auth Check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await request.json();

    // Remove _id from body to prevent MongoDB error
    delete body._id;

    const client = await clientPromise;
    const db = client.db("bookworm");

    //  Update
    const result = await db
      .collection("books")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...body, total_pages: Number(body.total_pages) } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//  Delete a Book
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const client = await clientPromise;
    const db = client.db("bookworm");

    // Soft Delete: Set is_deleted = true
    await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: { is_deleted: true } });

    return NextResponse.json({ message: "Book deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
