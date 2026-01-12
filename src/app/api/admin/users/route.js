import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

//   all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const client = await clientPromise;
    const users = await client
      .db("bookworm")
      .collection("users")
      .find({})
      .project({ password: 0 }) // Don't send passwords
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

//  Update Role
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin")
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });

    const { userId, newRole } = await request.json();

    // Prevent removing the last admin
    if (newRole === "user") {
      const client = await clientPromise;
      const adminCount = await client
        .db("bookworm")
        .collection("users")
        .countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot remove the last admin" },
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    await client
      .db("bookworm")
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { role: newRole } });

    return NextResponse.json({ message: "Role updated" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
