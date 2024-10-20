import React from "react";
import Bookmarks from "../bookmarks/Bookmarks";
import TrendsSidebar from "@/components/main/TrendsSidebar";
import { Metadata } from "next";
import SearchResults from "./SearchResults";
type PageProps = {
  searchParams: { q: string };
};

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: ` Search results for ${q}`,
  };
}
function page({ searchParams: { q } }: PageProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold line-clamp-2 break-all">
            Search results for <i>"{q}"</i>
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

export default page;
