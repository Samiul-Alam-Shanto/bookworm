import { Suspense } from "react";
import clientPromise from "@/lib/mongodb";
import BookCard from "@/components/books/BookCard";
import AdvancedFilterBar from "@/components/books/AdvancedFilterBar";
import PaginationControls from "@/components/books/PaginationControls";

//  Get Genres
async function getGenres() {
  const client = await clientPromise;
  const genres = await client
    .db("bookworm")
    .collection("genres")
    .find({})
    .sort({ name: 1 })
    .toArray();
  return genres.map((g) => ({ ...g, _id: g._id.toString() }));
}

//  Get Books
async function getBooks(resolvedParams) {
  const client = await clientPromise;
  const db = client.db("bookworm");

  //  Parse Params
  const search = resolvedParams.search;
  const genreString = resolvedParams.genres;
  const minRating = Number(resolvedParams.rating) || 0;
  const sortOption = resolvedParams.sort || "newest";
  const page = Number(resolvedParams.page) || 1;
  const limit = 8;
  const skip = (page - 1) * limit;

  //  Build Query
  let query = { is_deleted: { $ne: true } };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  if (genreString) {
    const decodedGenres = decodeURIComponent(genreString);
    const genreArray = decodedGenres.split(",");
    query.genres = { $in: genreArray };
  }

  if (minRating > 0) {
    query.average_rating = { $gte: minRating };
  }

  // Determine Sort
  let sort = {};
  if (sortOption === "rating_desc") {
    sort = { average_rating: -1 };
  } else if (sortOption === "popularity_desc") {
    sort = { total_reviews: -1 };
  } else {
    sort = { created_at: -1 };
  }

  //  Execute Query
  const [books, totalCount] = await Promise.all([
    db
      .collection("books")
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection("books").countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    books: books.map((book) => ({
      ...book,
      _id: book._id.toString(),
      created_at: book.created_at ? book.created_at : null,
      added_by: book.added_by ? book.added_by.toString() : null,
    })),
    meta: {
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      hasNextPage: page < totalPages,
    },
  };
}

export default async function BrowseBooksPage(props) {
  const searchParams = await props.searchParams;

  const [data, genres] = await Promise.all([
    getBooks(searchParams),
    getGenres(),
  ]);

  const { books, meta } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-bold font-serif mb-2">
          Discover Your Next Read
        </h1>
        <p className="text-muted-foreground">
          {meta.totalCount} books found matching your criteria.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-24 bg-muted animate-pulse rounded-lg mb-8" />
        }
      >
        <AdvancedFilterBar allGenres={genres} />
      </Suspense>

      {books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-10">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          <PaginationControls
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            hasNextPage={meta.hasNextPage}
          />
        </>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border">
          <h2 className="text-xl font-semibold mb-2">No books found</h2>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
