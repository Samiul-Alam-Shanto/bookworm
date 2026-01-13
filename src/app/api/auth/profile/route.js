import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name } = await request.json();
    const client = await clientPromise;

    await client
      .db("bookworm")
      .collection("users")
      .updateOne({ _id: new ObjectId(session.user.id) }, { $set: { name } });

    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
