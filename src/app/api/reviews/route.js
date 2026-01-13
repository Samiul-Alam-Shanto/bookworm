import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import { logActivity } from "@/lib/activity";

// POST: Submit a Review
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { bookId, rating, comment } = body;

    // console.log("server", bookId);
    if (!bookId || !rating || !comment) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bookworm");

    // Check if user already reviewed this book
    const existing = await db.collection("reviews").findOne({
      bookId: new ObjectId(bookId),
      userId: new ObjectId(session.user.id),
    });

    if (existing) {
      return NextResponse.json(
        { message: "You have already reviewed this book" },
        { status: 409 }
      );
    }

    const newReview = {
      bookId: new ObjectId(bookId),
      userId: new ObjectId(session.user.id),
      userName: session.user.name,
      userImage: session.user.image,
      rating: Number(rating),
      comment,
      status: "pending",
      createdAt: new Date(),
    };

    await db.collection("reviews").insertOne(newReview);

    await logActivity({
      userId: session.user.id,
      type: "REVIEW",
      bookId: bookId,
      meta: {
        rating: Number(rating),
        comment:
          comment.length > 80 ? comment.substring(0, 80) + "..." : comment,
      },
    });

    return NextResponse.json(
      { message: "Review submitted for approval!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
