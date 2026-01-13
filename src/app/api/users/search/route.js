import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const client = await clientPromise;
    const db = client.db("bookworm");
    const currentUserId = new ObjectId(session.user.id);

    //  Match Query
    let matchStage = {
      _id: { $ne: currentUserId },
      role: { $ne: "admin" },
    };

    if (query) {
      matchStage.name = { $regex: query, $options: "i" };
    }

    const users = await db
      .collection("users")
      .aggregate([
        { $match: matchStage },
        { $limit: 20 },
        {
          $lookup: {
            from: "follows",
            let: { userId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$followerId", currentUserId] },
                      { $eq: ["$followingId", "$$userId"] },
                    ],
                  },
                },
              },
            ],
            as: "isFollowing",
          },
        },
        {
          $project: {
            name: 1,
            image: 1,
            createdAt: 1,
            booksRead: {
              $size: {
                $filter: {
                  input: { $ifNull: ["$library", []] },
                  as: "item",
                  cond: { $eq: ["$$item.shelf", "read"] },
                },
              },
            },
            isFollowing: { $gt: [{ $size: "$isFollowing" }, 0] },
          },
        },
        { $sort: { booksRead: -1 } },
      ])
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("User Search Error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
