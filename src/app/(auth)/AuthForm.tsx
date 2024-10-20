"use client";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { loginSchema, signupSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, signUp } from "./actions";
import GoogleAuthButton from "./GoogleAuthButton";
type AuthFormTypes = { formType: "signup" | "login" };
function AuthForm({ formType }: AuthFormTypes) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const passwordtype: "text" | "password" = showPassword ? "text" : "password";
  const schema = formType == "login" ? loginSchema : signupSchema;
  const authenticate = formType == "login" ? login : signUp;
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof schema>) {
    startTransition(async () => {
      const { error } = await authenticate(values);
      if (error) setError(error);
    });
  }

  return (
    <div className="w-full lg:grid lg:max-h-[600px] lg:grid-cols-2 xl:max-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex w-full items-center justify-center">
              <Image
                src="/bubble-logo.png"
                width={72}
                height={52}
                alt="bubble logo"
              />
              <h1 className="mr-10 text-3xl font-bold">
                {formType == "login" ? "Login" : "Register"}
              </h1>
            </div>
            <p className="text-balance text-muted-foreground">
              {formType == "login"
                ? "Enter your email below to login to bubble"
                : "Enter your credentials to register for bubble"}
            </p>
          </div>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {formType === "signup" && (
                  <CustomInput
                    control={form.control}
                    placeholder="Enter your email address"
                    label="Email address"
                    name="email"
                  />
                )}
                <CustomInput
                  control={form.control}
                  placeholder="nastyPickle"
                  name="username"
                  label="Username"
                />
                <CustomInput
                  control={form.control}
                  placeholder="StrongPassHehe***"
                  name="password"
                  label="Password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  type={passwordtype}
                />
                {error && <FormMessage>{error}</FormMessage>}
                <Button
                  type="submit"
                  className="mt-4 w-full"
                  isLoading={isPending}
                  loadingText="submitting"
                  disabled={isPending}
                >
                  {formType == "login" ? "Login" : "Create account"}
                </Button>
                {/* <Button variant="outline" className="w-full">
                  {formType == "login"
                    ? "Login with Google"
                    : "Sign up with Google"}
                </Button> */}
                <GoogleAuthButton/>
              </form>
            </Form>
          </div>
          <div className="mt-2 text-center text-sm">
            {formType == "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Link
              href={formType == "login" ? "/sign-up" : "/login"}
              className="underline"
            >
              {formType == "login" ? "Sign Up" : "Login"}
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden items-center justify-center bg-muted lg:flex">
        <Image
          src={formType == "login" ? "/login.png" : "/signup.png"}
          alt="Image"
          width={2000}
          height={2000}
          className="m-auto object-cover "
        />
      </div>
    </div>
  );
}

export default AuthForm;
