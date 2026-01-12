import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bookworm");

    const genres = await db
      .collection("genres")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(genres);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}

//  Add a new genre (Admin Only)
export async function POST(request) {
  try {
    //  Security Check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Genre name is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bookworm");
    const collection = db.collection("genres");

    // Check Duplicate
    const existing = await collection.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existing) {
      return NextResponse.json(
        { message: "Genre already exists" },
        { status: 409 }
      );
    }

    // Create
    const newGenre = {
      name: name.trim(),
      slug: name.toLowerCase().trim().replace(/\s+/g, "-"),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newGenre);

    return NextResponse.json(
      {
        message: "Genre created",
        genre: { ...newGenre, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
