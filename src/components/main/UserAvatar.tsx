import { cn } from "@/lib/utils";
import Image from "next/image";

type UserAvatarProps = {
  avatarUrl: string | undefined | null;
  size?: number;
  className?: string;
};

function UserAvatar({ avatarUrl, className, size }: UserAvatarProps) {
  return (
    <Image
      src={avatarUrl || "/user-avatar.png"}
      width={size ?? 1050}
      height={size ?? 1050}
      alt="user avatar placeholder"
      className={cn("aspect-square h-fit flex-none rounded-full bg-secondary object-cover", className)}
    />
  );
}

export default UserAvatar;
