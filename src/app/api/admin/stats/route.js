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
    const db = client.db("bookworm");

    const [users, books, pendingReviews] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("books").countDocuments({ is_deleted: { $ne: true } }),
      db.collection("reviews").countDocuments({ status: "pending" }),
    ]);

    return NextResponse.json({ users, books, pendingReviews });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
