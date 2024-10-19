"use server";

import { db } from "@/lib/db";
import { keys, users } from "@/lib/db/schema";
import { lucia } from "@/lib/lucia";
import { validateRequest } from "@/lib/lucia/utils";
import { actionClient, ActionError } from "@/lib/safe-action";
import { signInSchema, signUpSchema } from "@/schemas/auth";
import { eq } from "drizzle-orm";
import { generateId, Scrypt } from "lucia";
import { returnValidationErrors } from "next-safe-action";
import { cookies } from "next/headers";

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput: { email, firstName, lastName, password } }) => {
    const userAlreadyExists = await db.query.users.findFirst({
      where: (table) => eq(table.email, email),
    });

    if (userAlreadyExists) {
      returnValidationErrors(signUpSchema, {
        email: {
          _errors: ["Email already taken"],
        },
      });
    }

    const hashedPassword = await new Scrypt().hash(password);
    const userId = generateId(15);

    try {
      await db
        .insert(users)
        .values({
          id: userId,
          email,
          firstName,
          lastName,
        })
        .returning({
          id: users.id,
          email: users.email,
        });

      await db
        .insert(keys)
        .values({
          id: generateId(15),
          hashedPassword,
          userId,
        })
        .returning({
          id: keys.id,
        });

      const session = await lucia.createSession(userId, {
        expiresIn: 60 * 60 * 24 * 30,
      });

      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return { userId };
    } catch (error: any) {
      returnValidationErrors(signUpSchema, {
        _errors: [error?.message || "Failed to create user"],
      });
    }
  });

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const existingUser = await db.query.users.findFirst({
      where: (table) => eq(table.email, email),
      with: {
        key: true,
      },
    });

    if (!existingUser || !existingUser.key.hashedPassword) {
      returnValidationErrors(signInSchema, {
        _errors: ["Incorrect email or password"],
      });
    }

    const isValidPassword = await new Scrypt().verify(
      existingUser.key.hashedPassword,
      password
    );

    if (!isValidPassword) {
      returnValidationErrors(signInSchema, {
        _errors: ["Incorrect email or password"],
      });
    }

    const session = await lucia.createSession(existingUser.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { user: existingUser };
  });

export const signOutAction = actionClient.action(async () => {
  const { session } = await validateRequest();

  if (!session) {
    throw new ActionError("Unauthorized");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
});
