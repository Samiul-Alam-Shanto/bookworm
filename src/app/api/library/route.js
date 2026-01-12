import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bookId, shelf, progress } = body;
    // shelf: "want-to-read", "currently-reading", "read", "none"

    if (!bookId || !shelf) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bookworm");
    const userId = new ObjectId(session.user.id);
    const bookObjectId = new ObjectId(bookId);

    //  Remove existing entry for this book
    await db
      .collection("users")
      .updateOne(
        { _id: userId },
        { $pull: { library: { bookId: bookObjectId } } }
      );

    //  If shelf is "none" (Remove from library)
    if (shelf === "none") {
      return NextResponse.json({ message: "Book removed from library" });
    }

    //  Prepare new entry
    const newEntry = {
      bookId: bookObjectId,
      shelf,
      progress: Number(progress) || 0,
      updatedAt: new Date(),
      // Add 'startedAt' if currently reading, 'finishedAt' if read
      ...(shelf === "currently-reading" && { startedAt: new Date() }),
      ...(shelf === "read" && { finishedAt: new Date(), progress: 100 }), // Force 100% if read
    };

    //  Push new entry
    await db
      .collection("users")
      .updateOne({ _id: userId }, { $push: { library: newEntry } });

    return NextResponse.json({ message: "Library updated" });
  } catch (error) {
    console.error("Library API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
