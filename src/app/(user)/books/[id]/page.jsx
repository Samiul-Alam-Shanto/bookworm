import { notFound } from "next/navigation";
import Image from "next/image";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ShelfButton from "@/components/books/ShelfButton";
import { Star, Clock, BookOpen } from "lucide-react";
import { ObjectId } from "mongodb";

async function getBookAndUserStatus(id) {
  const client = await clientPromise;
  const db = client.db("bookworm");

  //  Fetch Book
  let book;
  try {
    book = await db.collection("books").findOne({ _id: new ObjectId(id) });
  } catch (e) {
    return null; // Invalid ID format
  }

  if (!book) return null;

  //  Fetch User Status (if logged in)
  const session = await getServerSession(authOptions);
  let userStatus = { shelf: "none", progress: 0 };

  if (session) {
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(session.user.id) },
        { projection: { library: 1 } }
      );

    const entry = user?.library?.find((item) => item.bookId.toString() === id);
    if (entry) {
      userStatus = { shelf: entry.shelf, progress: entry.progress };
    }
  }

  return {
    book: {
      ...book,
      _id: book._id.toString(),
      created_at: book.created_at,
    },
    userStatus,
  };
}

export default async function BookDetailsPage(props) {
  const params = await props.params;
  const data = await getBookAndUserStatus(params.id);

  if (!data) return notFound();

  const { book, userStatus } = data;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Left: Cover & Shelf Button */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden shadow-2xl border border-border">
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* The Interactive Component */}
            <ShelfButton
              bookId={book._id}
              initialStatus={userStatus.shelf}
              initialProgress={userStatus.progress}
              totalPages={book.total_pages}
            />
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                by {book.author}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={24} />
                <span className="text-xl font-bold">
                  {book.average_rating || "N/A"}
                </span>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen size={20} />
                <span>{book.total_pages} Pages</span>
              </div>

              {book.genres && (
                <div className="flex gap-2">
                  {book.genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-bold font-serif mb-2">Synopsis</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {book.description}
              </p>
            </div>

            {/* Reviews Placeholder  */}
            <div className="pt-8 border-t border-border mt-8">
              <h3 className="text-2xl font-bold font-serif mb-4">
                Community Reviews
              </h3>
              <div className="bg-muted/30 p-8 rounded-xl text-center border border-dashed border-border">
                <p>Reviews coming in next update...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
