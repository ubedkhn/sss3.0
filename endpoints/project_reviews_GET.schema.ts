import superjson from "superjson";

export type Review = {
  id: string;
  projectId: string;
  displayName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type OutputType = {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
};

export const getProjectReviews = async (projectId: string, init?: RequestInit): Promise<OutputType> => {
  const url = new URL("/api/project_reviews", window.location.origin);
  url.searchParams.set("projectId", projectId);
  const r = await fetch(url.toString(), { method: "GET", ...init });
  if (!r.ok) throw new Error((await r.text()) || "Could not load reviews");
  return superjson.parse<OutputType>(await r.text());
};