import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const db = client.db("bookworm");
    const userId = new ObjectId(session.user.id);
    const currentYear = new Date().getFullYear();

    // Fetch User Data (Goal + Library)
    const user = await db
      .collection("users")
      .findOne(
        { _id: userId },
        { projection: { library: 1, reading_goal: 1 } }
      );

    const library = user?.library || [];
    const goal = user?.reading_goal || {
      year: currentYear,
      target: 10,
      current: 0,
    };
    // Filter "Read" Books for Current Year
    const readBooksThisYear = library.filter((item) => {
      if (item.shelf !== "read") return false;
      const finishDate = new Date(item.updatedAt);
      return finishDate.getFullYear() === currentYear;
    });

    const booksReadCount = readBooksThisYear.length;
    const totalPagesRead = readBooksThisYear.reduce(
      (acc, item) => acc + (item.progress || 0),
      0
    );

    // Calc Monthly Progress (Bar Chart)
    const monthlyData = Array(12).fill(0);
    readBooksThisYear.forEach((item) => {
      const month = new Date(item.updatedAt).getMonth(); // 0-11
      monthlyData[month]++;
    });

    //  Calc Favorite Genres (Pie Chart)
    const bookIds = readBooksThisYear.map((item) => item.bookId);
    let genreStats = [];

    if (bookIds.length > 0) {
      const books = await db
        .collection("books")
        .find({ _id: { $in: bookIds } })
        .project({ genres: 1 })
        .toArray();

      const genreCounts = {};
      books.forEach((b) => {
        b.genres?.forEach((g) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
      });

      genreStats = Object.entries(genreCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5
    }

    return NextResponse.json({
      goal: {
        target: goal.target,
        current: booksReadCount,
      },
      stats: {
        totalPages: totalPagesRead,
        avgRating: 0,
      },
      monthly: monthlyData.map((count, index) => ({
        name: new Date(0, index).toLocaleString("default", { month: "short" }),
        books: count,
      })),
      genres: genreStats,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
