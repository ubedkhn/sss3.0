import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { getProjectReviews } from "../endpoints/project_reviews_GET.schema";
import { postProjectReview } from "../endpoints/project_reviews_POST.schema";
import styles from "./ProjectReviews.module.css";

function Stars({ value, interactive = false, onChange }: { value: number; interactive?: boolean; onChange?: (value: number) => void }) {
  return (
    <div className={styles.stars} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Button key={star} type="button" variant="ghost" size="icon-sm" className={`${styles.star} ${star <= value ? styles.starActive : ""}`} aria-label={`${star} star${star === 1 ? "" : "s"}`} aria-pressed={interactive ? star === value : undefined} disabled={!interactive} onClick={() => onChange?.(star)}>
          ★
        </Button>
      ))}
    </div>
  );
}

export default function ProjectReviews({ projectId }: { projectId: string }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["project-reviews", projectId], queryFn: () => getProjectReviews(projectId) });
  const [rating, setRating] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mutation = useMutation({
    mutationFn: postProjectReview,
    onSuccess: async () => {
      setRating(0); setDisplayName(""); setEmail(""); setComment(""); setSubmitted(true);
      await qc.invalidateQueries({ queryKey: ["project-reviews", projectId] });
    },
  });
  const average = q.data?.averageRating ?? 0;
  const count = q.data?.totalReviews ?? 0;
  const ratingLabel = useMemo(() => (average ? average.toFixed(1) : "No ratings yet"), [average]);

  return (
    <section className={styles.section} aria-labelledby="project-reviews-title">
      <div className={styles.heading}>
        <div><p className={styles.kicker}>CLIENT IMPRESSIONS</p><h2 id="project-reviews-title">A considered space is experienced, not simply photographed.</h2></div>
        <div className={styles.summary}><strong>{ratingLabel}</strong><Stars value={Math.round(average)} /><span>{count} {count === 1 ? "review" : "reviews"}</span></div>
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={(event) => { event.preventDefault(); if (!rating) return; mutation.mutate({ projectId, displayName, email, rating, comment }); }}>
          <div className={styles.formIntro}><p>Share your experience of this project. Your review will appear publicly after submission.</p>{submitted && <span className={styles.success}>Thank you. Your review is now part of the project record.</span>}{mutation.isError && <span className={styles.error}>{mutation.error instanceof Error ? mutation.error.message : "Could not submit your review."}</span>}</div>
          <div className={styles.ratingField}><span>YOUR RATING</span><Stars value={rating} interactive onChange={setRating} /></div>
          <div className={styles.twoCol}>
            <label><span>NAME</span><Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" required maxLength={80} /></label>
            <label><span>EMAIL · OPTIONAL</span><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={160} /></label>
          </div>
          <label><span>COMMENT</span><Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What stood out to you about this project?" required maxLength={1200} /></label>
          <Button type="submit" disabled={mutation.isPending || rating === 0}>{mutation.isPending ? "Publishing…" : "Publish review ↗"}</Button>
        </form>
        <div className={styles.list}>
          {q.isFetching && <p className={styles.muted}>Loading the project record…</p>}
          {!q.isFetching && !q.data?.reviews.length && <p className={styles.muted}>Be the first visitor to leave a considered note about this project.</p>}
          {q.data?.reviews.map((review) => (
            <article className={styles.review} key={review.id}>
              <div className={styles.reviewTop}><div><strong>{review.displayName}</strong><span>{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div><Stars value={review.rating} /></div>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}