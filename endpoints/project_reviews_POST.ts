import { schema } from "./project_reviews_POST.schema";
import { db } from "../helpers/db";
import superjson from "superjson";

export async function handle(request: Request) {
  try {
    const input = schema.parse(superjson.parse(await request.text()));
    const project = await db.selectFrom("projects").select("id").where("id", "=", input.projectId).where("published", "=", true).executeTakeFirst();
    if (!project) return new Response(superjson.stringify({ error: "Project not found" }), { status: 404 });
    await db.insertInto("projectReviews").values({
      projectId: input.projectId,
      displayName: input.displayName,
      email: input.email || null,
      rating: input.rating,
      comment: input.comment,
    }).execute();
    return new Response(superjson.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(superjson.stringify({ error: error instanceof Error ? error.message : "Invalid review" }), { status: 400 });
  }
}