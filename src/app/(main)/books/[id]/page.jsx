import { notFound } from "next/navigation";
import Image from "next/image";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ShelfButton from "@/components/books/ShelfButton";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Star, BookOpen, User } from "lucide-react";
import { ObjectId } from "mongodb";

async function getBookData(id) {
  const client = await clientPromise;
  const db = client.db("bookworm");

  //  Fetch Book
  let book;
  try {
    book = await db.collection("books").findOne({ _id: new ObjectId(id) });
  } catch (e) {
    return null;
  }
  if (!book) return null;

  //  Fetch User Status (for Shelf Button)
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

  // Fetch Approved Reviews
  // Sort by newest first
  const reviews = await db
    .collection("reviews")
    .find({ bookId: new ObjectId(id), status: "approved" })
    .sort({ createdAt: -1 })
    .toArray();

  return {
    book: {
      ...book,
      _id: book._id.toString(),
      created_at: book.created_at,
    },
    reviews: reviews.map((r) => ({
      ...r,
      _id: r._id.toString(),
      bookId: r.bookId.toString(),
      userId: r.userId.toString(),
      createdAt: r.createdAt,
    })),
    userStatus,
  };
}

export default async function BookDetailsPage(props) {
  const params = await props.params;
  const data = await getBookData(params.id);

  if (!data) return notFound();

  const { book, reviews, userStatus } = data;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        {/* TOP SECTION: Book Info */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-16">
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
            <ShelfButton
              bookId={book._id}
              initialStatus={userStatus.shelf}
              initialProgress={userStatus.progress}
              totalPages={book.total_pages}
            />
          </div>

          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                by {book.author}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={24} />
                <span className="text-xl font-bold">
                  {book.average_rating ? book.average_rating.toFixed(1) : "N/A"}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({book.total_reviews} reviews)
                </span>
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

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-bold font-serif mb-2">Synopsis</h3>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {book.description}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border pt-12">
          {/* List of Reviews */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-serif mb-6">
              Community Reviews ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <p className="text-muted-foreground italic">
                No reviews yet. Be the first!
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-card p-4 rounded-xl border border-border"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                        {review.userImage ? (
                          <Image
                            src={review.userImage}
                            alt={review.userName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-sm">
                        {review.userName}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-foreground/90 leading-relaxed text-sm">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Form */}
          <div>
            <ReviewForm bookId={book._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
