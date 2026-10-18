import {getServerUserSession} from "../helpers/getServerUserSession";
import {NotAuthenticatedError} from "../helpers/getSetServerSession";
import {db} from "../helpers/db";
import superjson from "superjson";

const privateHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, private",
};

export async function handle(request: Request) {
  try {
    const session = await getServerUserSession(request);
    const user = session.user;
    if (user.role !== "admin") {
      return new Response(superjson.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: privateHeaders,
      });
    }

    const results = await Promise.allSettled([
      db.selectFrom("inquiries").selectAll().orderBy("createdAt", "desc").execute(),
      db.selectFrom("projects").selectAll().orderBy("updatedAt", "desc").execute(),
      db.selectFrom("journalPosts").selectAll().orderBy("updatedAt", "desc").execute(),
      db.selectFrom("projectReviews").selectAll().orderBy("createdAt", "desc").execute(),
    ]);

    const labels = ["inquiries", "projects", "journalPosts", "projectReviews"];
    const failures = results
      .map((result, index) =>
        result.status === "rejected"
          ? {
              source: labels[index],
              message: result.reason instanceof Error ? result.reason.message : "Database query failed",
            }
          : null
      )
      .filter(Boolean);

    for (const failure of failures) {
      console.error("Admin data query failed:", failure);
    }

    const [inquiriesResult, projectsResult, postsResult, reviewsResult] = results;
    const inquiries = inquiriesResult.status === "fulfilled" ? inquiriesResult.value : [];
    const projects = projectsResult.status === "fulfilled" ? projectsResult.value : [];
    const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
    const reviews = reviewsResult.status === "fulfilled" ? reviewsResult.value : [];

    return new Response(superjson.stringify({ inquiries, projects, posts, reviews }), {
      headers: privateHeaders,
    });
  } catch (error) {
    if (error instanceof NotAuthenticatedError) {
      return new Response(superjson.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: privateHeaders,
      });
    }
    return new Response(superjson.stringify({ error: "Admin data unavailable" }), {
      status: 500,
      headers: privateHeaders,
    });
  }
}