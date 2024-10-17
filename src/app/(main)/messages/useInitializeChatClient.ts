import { useSession } from "@/components/providers/SessionProvider";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: user.id,
          username: user.username,
          name: user.displayName,
          image: user.avatarUrl,
        },
        async (): Promise<string> => {
          const response = await fetch("/api/get-token");
          const data: { token: string } = await response.json();
          return data.token;
        },
      )
      .catch((error) => console.error(error, "failed to connect user"))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error(error, "failed to disconnect user"))
        .then(() => console.log("connection closed"));
    };
  }, [user.id, user.displayName, user.username, user.avatarUrl]);

  return chatClient;
}
