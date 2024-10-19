import { createSafeActionClient } from "next-safe-action";
import { validateRequest } from "./lucia/utils";
export class ActionError extends Error {}

const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong";
export const actionClient = createSafeActionClient({
  // Can also be an async function.
  handleServerError(e) {
    // Log to console.
    console.error("Action error:", e.message);

    // In this case, we can use the 'MyCustomError` class to unmask errors
    // and return them with their actual messages to the client.
    if (e instanceof ActionError) {
      return {
        message: e.message,
      };
    }

    // Every other error that occurs will be masked with the default message.
    return {
      message: DEFAULT_SERVER_ERROR_MESSAGE,
    };
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { session, user } = await validateRequest();

  if (!session) {
    throw new ActionError("Session not valid!");
  }

  if (!user) {
    throw new ActionError("User not found!");
  }

  // Return the next middleware with `userId` value in the context
  return next({ ctx: { userId: user.id, user, session } });
});
