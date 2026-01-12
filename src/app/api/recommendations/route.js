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

    //  Fetch User's Library to analyze tastes
    const user = await db
      .collection("users")
      .findOne({ _id: userId }, { projection: { library: 1 } });

    const library = user?.library || [];

    // Get list of Book IDs
    const excludedBookIds = library.map((item) => item.bookId);

    // Get "Read" books to find genres
    const readBookIds = library
      .filter((item) => item.shelf === "read")
      .map((item) => item.bookId);

    let recommendations = [];

    //  Content-Based Filtering (If user has read books)
    if (readBookIds.length > 0) {
      const readBooks = await db
        .collection("books")
        .find({ _id: { $in: readBookIds } })
        .project({ genres: 1 })
        .toArray();

      // Flatten genres and count frequency
      const genreCounts = {};
      readBooks.forEach((book) => {
        if (book.genres) {
          book.genres.forEach((genre) => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
          });
        }
      });

      // Sort genres
      const topGenres = Object.keys(genreCounts).sort(
        (a, b) => genreCounts[b] - genreCounts[a]
      );

      recommendations = await db
        .collection("books")
        .find({
          _id: { $nin: excludedBookIds },
          genres: { $in: topGenres },
          average_rating: { $gte: 4.0 },
          is_deleted: { $ne: true },
        })
        .sort({ average_rating: -1 })
        .limit(10)
        .toArray();
    }

    //  Fallback (Popular/Top Rated)
    if (recommendations.length < 8) {
      const existingIds = [
        ...excludedBookIds,
        ...recommendations.map((b) => b._id),
      ];

      const popularBooks = await db
        .collection("books")
        .find({
          _id: { $nin: existingIds },
          is_deleted: { $ne: true },
        })
        .sort({ average_rating: -1, total_reviews: -1 })
        .limit(10 - recommendations.length)
        .toArray();

      recommendations = [...recommendations, ...popularBooks];
    }

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Recommendation Error:", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
