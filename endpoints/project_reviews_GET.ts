import { db } from "../helpers/db";
import superjson from "superjson";

export async function handle(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId");
  if (!projectId) return new Response(superjson.stringify({ error: "projectId is required" }), { status: 400 });
  const reviews = await db.selectFrom("projectReviews").selectAll().where("projectId", "=", projectId).orderBy("createdAt", "desc").limit(100).execute();
  const averageRating = reviews.length ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)) : 0;
  return new Response(superjson.stringify({
    reviews: reviews.map((review) => ({ id: String(review.id), projectId: String(review.projectId), displayName: review.displayName, rating: review.rating, comment: review.comment, createdAt: review.createdAt })),
    averageRating,
    totalReviews: reviews.length,
  }), { headers: { "Content-Type": "application/json" } });
}