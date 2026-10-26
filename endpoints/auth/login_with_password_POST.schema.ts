import { z } from "zod";
import { StudioUser, signIn } from "../../helpers/supabaseAuth";

export const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type OutputType = { user: StudioUser };
export const postLogin = async (body: z.infer<typeof schema>): Promise<OutputType> => {
  const input = schema.parse(body);
  return { user: await signIn(input.email, input.password) };
};
