import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("bookworm");

    const query = { is_deleted: { $ne: true } };

    const books = await db
      .collection("books")
      .find(query)
      .sort({ created_at: -1 })
      .toArray();

    console.log(`Found ${books.length} books`);

    return NextResponse.json(books);
  } catch (error) {
    console.error("Books API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("bookworm");

    // Ensure numeric fields are numbers
    const newBook = {
      ...body,
      total_pages: Number(body.total_pages),
      average_rating: 0,
      total_reviews: 0,
      created_at: new Date(),
      is_deleted: false,
    };

    const result = await db.collection("books").insertOne(newBook);

    return NextResponse.json(
      {
        message: "Book created",
        bookId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
