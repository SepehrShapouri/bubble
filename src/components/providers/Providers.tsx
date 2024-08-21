import React, { ReactNode } from "react";
import SessionProvider from "./SessionProvider";
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";

async function Providers({ children }: { children: ReactNode }) {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  return <SessionProvider value={session}>{children}</SessionProvider>;
}

export default Providers;
