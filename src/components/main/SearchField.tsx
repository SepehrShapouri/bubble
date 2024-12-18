"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

function SearchField() {
  const router = useRouter();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const query = (form.query as HTMLInputElement).value.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }
  return (
    <form onSubmit={handleSubmit} method="get" action="/search">
      <div className="relative">
        <Input name="query" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}

export default SearchField;
