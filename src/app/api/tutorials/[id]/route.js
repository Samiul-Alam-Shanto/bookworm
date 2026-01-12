import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("bookworm");

    await db.collection("tutorials").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
