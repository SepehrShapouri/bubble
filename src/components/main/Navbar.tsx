import Image from "next/image";
import Link from "next/link";
import React from "react";
import UserButton from "./UserButton";
import SearchField from "./SearchField";

function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-3 py-2 sm:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold "
        >
          <Image
            src="/bubble-logo.png"
            width={62}
            height={42}
            alt="bubble logo"
          />
          <h1 className="hidden sm:block">bubble</h1>
        </Link>
        <div className="flex items-center gap-4">
          <SearchField />
          <UserButton className="sm:ms-auto" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
