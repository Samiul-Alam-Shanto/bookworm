import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("bookworm");
    const userId = new ObjectId(session.user.id);

    //  Get who I follow
    const following = await db
      .collection("follows")
      .find({ followerId: userId })
      .toArray();
    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Include myself

    // Get activities
    const activities = await db
      .collection("activities")
      .aggregate([
        { $match: { userId: { $in: followingIds } } },
        { $sort: { createdAt: -1 } },
        { $limit: 20 },
        // Populate User
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        // Populate Book
        {
          $lookup: {
            from: "books",
            localField: "bookId",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: { path: "$book", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            type: 1,
            meta: 1,
            createdAt: 1,
            "user.name": 1,
            "user.image": 1,
            "user._id": 1,
            "book.title": 1,
            "book.cover_image": 1,
            "book._id": 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
