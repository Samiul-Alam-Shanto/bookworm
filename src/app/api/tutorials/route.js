import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

// Extract YouTube ID
const getYouTubeID = (url) => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      return parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "");
    }

    return null;
  } catch {
    return null;
  }
};

// Fetch all tutorials
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bookworm");
    const tutorials = await db
      .collection("tutorials")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(tutorials);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// Add Tutorial (Admin Only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { title, url } = await request.json();
    const videoId = getYouTubeID(url);

    if (!title || !videoId) {
      return NextResponse.json(
        { message: "Invalid URL or Title" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bookworm");

    const newTutorial = {
      title,
      url,
      videoId,
      addedBy: session.user.email,
      createdAt: new Date(),
    };

    await db.collection("tutorials").insertOne(newTutorial);

    return NextResponse.json({ message: "Tutorial added" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
