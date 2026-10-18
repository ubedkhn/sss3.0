import superjson from "superjson";
import { z } from "zod";

export const schema = z.object({
  projectId: z.string().min(1),
  displayName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1200),
});

export type InputType = z.infer<typeof schema>;
export type OutputType = { success: boolean };

export const postProjectReview = async (body: InputType, init?: RequestInit): Promise<OutputType> => {
  const r = await fetch("/_api/project_reviews", {
    method: "POST",
    body: superjson.stringify(schema.parse(body)),
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!r.ok) throw new Error((await r.text()) || "Could not submit review");
  return superjson.parse<OutputType>(await r.text());
};