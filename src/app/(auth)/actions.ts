"use server";

import { db } from "@/lib/db";
import { authSchema, AuthSchemaValues } from "../../lib/validation";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize, Session } from "lucia";
import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect";

async function createUserSession(userId: string) {
  const session = await lucia.createSession(userId, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}
export async function signUp(
  credentials: AuthSchemaValues,
): Promise<{ error: string }> {
  console.log(credentials);
  try {
    const { email, username, password } = authSchema.parse(credentials);

    const password_hash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
});

    const userId = generateIdFromEntropySize(10);

    const existingUsername = await db.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });

    if (existingUsername) {
      return {
        error:
          "The choosen userame has already been picked, Choose a different username, how about NastyPickle?",
      };
    }
    const existingEmail = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });
    console.log("no existing email");

    if (existingEmail) {
      return { error: "The email address has already been picked." };
    }
    console.log("no existing user");
    await db.user.create({
      data: {
        username,
        email,
        id: userId,
        displayName: username,
        password_hash,
      },
    });
    // const session = await lucia.createSession(userId, {});

    // const sessionCookie = lucia.createSessionCookie(session.id);

    // cookies().set(
    //   sessionCookie.name,
    //   sessionCookie.value,
    //   sessionCookie.attributes,
    // );
    // console.log("created");
    await createUserSession(userId)
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error: "Something went wrong, Please try again.",
    };
  }
}

export async function login(
  credentials: AuthSchemaValues,
): Promise<{ error: string }> {
  try {
    const { username, password } = authSchema.parse(credentials);

    const existingUser = await db.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });

    if (!existingUser || !existingUser.password_hash) {
      return { error: "Incorrect username or password" };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      return { error: "Incorrect username or password" };
    }

    await createUserSession(existingUser.id);
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return { error: "Something went wrong, please try again." };
  }
}

export async function logout() {
  const { session } = await validateRequest();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
}
