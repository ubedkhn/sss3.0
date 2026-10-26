import { z } from "zod";
import { signOut } from "../../helpers/supabaseAuth";
export const schema = z.object({});
export type OutputType = { success: boolean; message?: string };
export const postLogout = async (): Promise<OutputType> => {
  await signOut();
  return { success: true, message: "Signed out" };
};
