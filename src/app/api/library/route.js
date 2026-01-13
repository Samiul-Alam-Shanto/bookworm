import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import { logActivity } from "@/lib/activity";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookId, shelf, progress } = body;

    if (!bookId || !shelf) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bookworm");
    const userId = new ObjectId(session.user.id);
    const bookObjectId = new ObjectId(bookId);

    // Remove existing entry
    await db
      .collection("users")
      .updateOne(
        { _id: userId },
        { $pull: { library: { bookId: bookObjectId } } }
      );

    if (shelf === "none") {
      return NextResponse.json({ message: "Book removed" });
    }

    //  Add new entry
    const newEntry = {
      bookId: bookObjectId,
      shelf,
      progress: Number(progress) || 0,
      updatedAt: new Date(),
      ...(shelf === "currently-reading" && { startedAt: new Date() }),
      ...(shelf === "read" && { finishedAt: new Date(), progress: 100 }),
    };

    await db
      .collection("users")
      .updateOne({ _id: userId }, { $push: { library: newEntry } });

    //  Log Activity
    await logActivity({
      userId: session.user.id,
      type: "SHELF_UPDATE",
      bookId: bookId,
      meta: { shelf },
    });

    return NextResponse.json({ message: "Library updated" });
  } catch (error) {
    console.error("Library API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bookworm");
    const userId = new ObjectId(session.user.id);

    // Aggregation Pipeline
    const library = await db
      .collection("users")
      .aggregate([
        { $match: { _id: userId } },
        { $unwind: "$library" }, // Flatten array
        {
          $lookup: {
            from: "books",
            localField: "library.bookId",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        { $unwind: "$bookDetails" }, // Flatten lookup array
        {
          $project: {
            _id: 0,
            status: "$library.shelf",
            progress: "$library.progress",
            updatedAt: "$library.updatedAt",
            book: "$bookDetails", // Put full book object here
          },
        },
        { $sort: { updatedAt: -1 } }, // Most recently updated first
      ])
      .toArray();

    return NextResponse.json(library);
  } catch (error) {
    console.error("Library Fetch Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch library" },
      { status: 500 }
    );
  }
}
