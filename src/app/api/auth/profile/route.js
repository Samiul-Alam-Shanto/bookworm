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

    const { name, image } = await request.json();
    const client = await clientPromise;

    const updateDoc = { name };
    if (image) updateDoc.image = image;

    await client
      .db("bookworm")
      .collection("users")
      .updateOne({ _id: new ObjectId(session.user.id) }, { $set: updateDoc });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
