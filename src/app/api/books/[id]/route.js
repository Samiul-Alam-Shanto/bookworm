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

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Book ID" }, { status: 400 });
    }

    //  Clean Body
    const body = await request.json();
    delete body._id;

    // Ensure numbers are numbers
    if (body.total_pages) body.total_pages = Number(body.total_pages);

    const client = await clientPromise;
    const db = client.db("bookworm");

    // Perform Update
    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: body });

    //  Check if anything actually changed
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Book not found in DB" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Book updated successfully" });
  } catch (error) {
    // console.error("Update API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

//  Soft Delete a Book
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid Book ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bookworm");

    // Soft Delete: Set is_deleted = true
    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: { is_deleted: true } });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Book not found to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Book deleted" });
  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
