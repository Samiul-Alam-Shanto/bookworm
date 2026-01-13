import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const client = await clientPromise;
    // Join with books to show Book Title
    const reviews = await client
      .db("bookworm")
      .collection("reviews")
      .aggregate([
        { $match: { status: "pending" } },
        {
          $lookup: {
            from: "books",
            localField: "bookId",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
