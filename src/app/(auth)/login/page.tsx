import { Metadata } from "next";
import React from "react";
import AuthForm from "../AuthForm";
export const metadata: Metadata = {
  title: "Login",
};
function page() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card lg:shadow-2xl">
        <AuthForm formType="login"/>
      </div>
    </main>
  );
}

export default page;
