"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book._id}`} className="group h-full flex flex-col">
      <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden shadow-sm border border-border group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
        <Image
          src={
            book.cover_image || "https://i.ibb.co/5GzXywq/default-avatar.png"
          }
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-4 py-2 bg-white/90 text-black text-sm font-bold rounded-full transform scale-90 group-hover:scale-100 transition-transform">
            View Details
          </span>
        </div>
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        <h3 className="font-bold font-serif text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {book.author}
        </p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-medium text-foreground">
              {book.average_rating
                ? Number(book.average_rating).toFixed(1)
                : "N/A"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {book.genres?.[0] || "General"}
          </span>
        </div>
      </div>
    </Link>
  );
}
