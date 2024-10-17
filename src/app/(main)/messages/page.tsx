import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Messages",
};

function page() {
  return <Chat />;
}

export default page;
