import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

// Helper to Recalculate Stats
async function updateBookStats(db, bookId) {
  const stats = await db
    .collection("reviews")
    .aggregate([
      { $match: { bookId: bookId, status: "approved" } },
      {
        $group: {
          _id: "$bookId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  if (stats.length > 0) {
    await db.collection("books").updateOne(
      { _id: bookId },
      {
        $set: {
          average_rating: stats[0].avgRating,
          total_reviews: stats[0].count,
        },
      }
    );
  } else {
    // If no reviews left, reset to 0
    await db
      .collection("books")
      .updateOne(
        { _id: bookId },
        { $set: { average_rating: 0, total_reviews: 0 } }
      );
  }
}

// PATCH: Approve Review
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { id } = params;
    const { status } = await request.json();

    const client = await clientPromise;
    const db = client.db("bookworm");

    //  Get the review first to know which book it belongs to
    const review = await db
      .collection("reviews")
      .findOne({ _id: new ObjectId(id) });
    if (!review)
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );

    //  Update Status
    await db
      .collection("reviews")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

    //  Trigger Recalculation
    await updateBookStats(db, review.bookId);

    return NextResponse.json({ message: "Review updated" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// DELETE: Remove Review
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { id } = params;
    const client = await clientPromise;
    const db = client.db("bookworm");

    //  Get review to find bookId
    const review = await db
      .collection("reviews")
      .findOne({ _id: new ObjectId(id) });
    if (!review)
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );

    //  Delete
    await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });

    //  Trigger Recalculation (Crucial: removing a review changes the average)
    await updateBookStats(db, review.bookId);

    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
