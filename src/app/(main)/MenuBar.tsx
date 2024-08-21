import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        title="Home"
        href="/"
      >
        {" "}
        <Home />
        <span className="hidden lg:inline">Home</span>
      </Link>
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        href="/notifications"
      >
        {" "}
        <Bell />
        <span className="hidden lg:inline">Notifications</span>
      </Link>
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        href="/messages"
      >
        {" "}
        <Mail />
        <span className="hidden lg:inline">Messages</span>
      </Link>
      <Link
        className={cn(
          buttonVariants({
            variant: "ghost",
            className: "flex items-center justify-start gap-3",
          }),
        )}
        href="/bookmarks"
      >
        {" "}
        <Bookmark />
        <span className="hidden lg:inline">Bookmarks</span>
      </Link>
    </div>
  );
}
