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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Core Counts
    const [totalBooks, totalUsers, pendingReviews] = await Promise.all([
      db.collection("books").countDocuments({ is_deleted: { $ne: true } }),
      db.collection("users").countDocuments(),
      db.collection("reviews").countDocuments({ status: "pending" }),
    ]);

    //  Active Users who updated library
    const newUsersLast7Days = await db
      .collection("users")
      .countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    //  Genre Distribution (What users are reading)
    const genreStats = await db
      .collection("users")
      .aggregate([
        { $unwind: "$library" },
        {
          $lookup: {
            from: "books",
            localField: "library.bookId",
            foreignField: "_id",
            as: "book",
          },
        },
        { $unwind: "$book" },
        { $unwind: "$book.genres" },
        { $group: { _id: "$book.genres", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    //  Daily Activity (Last 7 days)
    const dailyActivity = await db
      .collection("reviews")
      .aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray();

    // Format for Chart
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const display = d.toLocaleDateString("en-US", { weekday: "short" });
      const entry = dailyActivity.find((e) => e._id === dateStr);
      chartData.push({ name: display, reviews: entry ? entry.count : 0 });
    }

    return NextResponse.json({
      totalBooks,
      totalUsers,
      pendingReviews,
      newUsersLast7Days,
      chartData,
      topGenres: genreStats.map((g) => ({ name: g._id, value: g.count })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
