import { z } from "zod";
import { getCurrentUser } from "../../helpers/supabaseAuth";
export const schema = z.object({});
export type OutputType = { user: Awaited<ReturnType<typeof getCurrentUser>> } | { error: string };
export const getSession = async (): Promise<OutputType> => {
  try { return { user: await getCurrentUser() }; }
  catch (error) {
    const message = error instanceof Error ? error.message : "Session check failed";
    if (message === "You are signed out." || /expired|invalid.*token|JWT/i.test(message)) return { error: message };
    throw error;
  }
};
