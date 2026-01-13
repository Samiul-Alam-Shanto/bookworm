import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import { logActivity } from "@/lib/activity";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const targetUserId = (await params).id;
    const currentUserId = session.user.id;

    if (targetUserId === currentUserId) {
      return NextResponse.json(
        { message: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bookworm");

    // Check if already following
    const existing = await db.collection("follows").findOne({
      followerId: new ObjectId(currentUserId),
      followingId: new ObjectId(targetUserId),
    });

    if (existing) {
      // Unfollow
      await db.collection("follows").deleteOne({ _id: existing._id });
      return NextResponse.json({ isFollowing: false });
    } else {
      // Follow
      await db.collection("follows").insertOne({
        followerId: new ObjectId(currentUserId),
        followingId: new ObjectId(targetUserId),
        createdAt: new Date(),
      });

      // Log it
      await logActivity({
        userId: currentUserId,
        type: "FOLLOW",
        meta: { targetId: targetUserId },
      });

      return NextResponse.json({ isFollowing: true });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// Check Follow Status
export async function GET(request, { params }) {
  // Simple check if I follow this user
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ isFollowing: false });

  const targetUserId = (await params).id;
  const client = await clientPromise;
  const count = await client
    .db("bookworm")
    .collection("follows")
    .countDocuments({
      followerId: new ObjectId(session.user.id),
      followingId: new ObjectId(targetUserId),
    });

  return NextResponse.json({ isFollowing: count > 0 });
}
