"use client";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, signUp } from "./actions";
type AuthFormTypes = {
  formType: "signup" | "login";
};
function AuthForm({ formType }: AuthFormTypes) {
  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof authSchema>) {
    if(formType == 'login'){
        login(values)
    }
    else{
        signUp(values)
    }
  }
  return (
    <div className="w-full lg:grid lg:max-h-[600px] lg:grid-cols-2 xl:max-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              {formType == "login" ? "Login" : "Create an account"}
            </h1>
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
                />
                            <Button type="submit" className="w-full mt-4">
              {formType == "login" ? "Login" : "Create account"}
            </Button>
            <Button variant="outline" className="w-full">
              {formType == "login"
                ? "Login with Google"
                : "Sign up with Google"}
            </Button>
              </form>
            </Form>
          </div>
          <div className="mt-4 text-center text-sm">
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
          className="m-auto object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default AuthForm;
