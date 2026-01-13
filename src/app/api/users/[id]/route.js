import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("bookworm");

    // Get User Info
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(id) },
        { projection: { name: 1, image: 1, createdAt: 1, library: 1 } }
      );

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    //  Filter Library
    const publicLibrary = (user.library || []).filter(
      (item) => item.shelf === "read" || item.shelf === "currently-reading"
    );

    //  Populate Book Details for those items
    const bookIds = publicLibrary.map((item) => item.bookId);

    const books = await db
      .collection("books")
      .find({ _id: { $in: bookIds } })
      .project({ title: 1, author: 1, cover_image: 1, average_rating: 1 })
      .toArray();

    // Map details back to library items
    const populatedLibrary = publicLibrary
      .map((item) => {
        const bookDetails = books.find(
          (b) => b._id.toString() === item.bookId.toString()
        );
        return bookDetails
          ? { ...bookDetails, _id: bookDetails._id.toString() }
          : null;
      })
      .filter(Boolean);

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
      library: populatedLibrary,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
