import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function logActivity({ userId, type, bookId, meta = {} }) {
  try {
    const client = await clientPromise;
    const db = client.db("bookworm");

    console.log(`[ActivityLog] Saving: ${type} for User ${userId}`);

    const activity = {
      userId: new ObjectId(userId), // Ensure ObjectId
      type,
      bookId: bookId ? new ObjectId(bookId) : null, // Ensure ObjectId
      meta,
      createdAt: new Date(),
    };

    await db.collection("activities").insertOne(activity);
    // console.log("[ActivityLog] Success");
  } catch (error) {
    // console.error("[ActivityLog] Failed:", error);
  }
}
