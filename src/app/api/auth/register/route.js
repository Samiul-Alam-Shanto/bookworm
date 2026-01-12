import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, photo } = body;

    // Validate Input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, Email, and Password are required" },
        { status: 400 }
      );
    }

    //  Connect DB
    const client = await clientPromise;
    const db = client.db("bookworm");
    const usersCollection = db.collection("users");

    //  Check Existing User
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    //  Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create User Object (Strict Schema Adherence)
    const newUser = {
      name,
      email,
      password: hashedPassword,
      image: photo || "https://i.ibb.co/5GzXywq/default-avatar.png",
      role: "user", // Default role
      createdAt: new Date(),

      // Initialize Goal (Prevents 'undefined' errors on Dashboard)
      reading_goal: {
        year: new Date().getFullYear(),
        target: 0,
        current: 0,
      },

      // Initialize Library
      library: [],
    };

    //  Insert
    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "User created successfully", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
