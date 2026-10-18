import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../endpoints/projects_GET.schema";
import SiteLayout from "../components/SiteLayout";
import ProjectReviews from "../components/ProjectReviews";
import { useLuxuryMotion } from "../helpers/useLuxuryMotion";
import styles from "./portfolio.$slug.module.css";

export default function PortfolioCaseStudy() {
  const { slug } = useParams();
  const [comparison,setComparison] = useState(50);
  const q = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const p = q.data?.projects?.find((x: any) => x.slug === slug);

  useLuxuryMotion(p?.id);

  if (q.isFetching) {
    return <SiteLayout><div className={styles.loading}>Opening the archive…</div></SiteLayout>;
  }

  if (!p) {
    return <SiteLayout><div className={styles.loading}><h1>Project not found.</h1><Link to="/portfolio">Return to portfolio ↗</Link></div></SiteLayout>;
  }

  const gallery = Array.isArray(p.galleryItems) ? p.galleryItems : [];
  const beforeAfter = Array.isArray(p.beforeAfterItems) ? p.beforeAfterItems : [];
  const beforeItem = beforeAfter.find((item:any) => /before/i.test(item.layout || item.caption || "")) || beforeAfter[0];
  const afterItem = beforeAfter.find((item:any) => /after/i.test(item.layout || item.caption || "")) || beforeAfter[1];
  const size = p.squareFootage ? p.squareFootage.toLocaleString() + " sq ft" : "Bespoke scope";

  return (
    <SiteLayout>
      <Helmet>
        <title>{p.seoTitle || p.name + " | Shri Sawariya Seth Interior Designs"}</title>
        <meta name="description" content={p.seoDescription || p.vision} />
      </Helmet>

      <header className={styles.hero} data-parallax-container>
        <img data-parallax-image data-parallax-strength="hero" src={p.coverImageUrl} alt={p.heroAltText || p.name} />
        <div className={styles.heroOverlay}>
          <p>SELECTED WORK · {p.year}</p>
          <h1>{p.name}</h1>
          <div><span>{p.location}</span><span>{p.projectType}</span><span>{size}</span></div>
        </div>
      </header>

      <main>
        <section className={styles.specs}>
          <div><span>LOCATION</span><strong>{p.location}</strong></div>
          <div><span>SIZE</span><strong>{size}</strong></div>
          <div><span>SCOPE</span><strong>{p.projectType}</strong></div>
          <div><span>YEAR</span><strong>{p.year}</strong></div>
        </section>

        <section className={styles.editorial}>
          <p className={styles.kicker}>THE BRIEF</p>
          <div><h2>Design begins by listening to what the architecture cannot say on its own.</h2><p>{p.clientBrief}</p></div>
        </section>

        <section className={styles.story}>
          <div><p className={styles.kicker}>01 · THE VISION</p><h2>The Vision</h2></div>
          <p>{p.vision}</p>
        </section>

        <section className={styles.fullImage} data-parallax-container>
          <img data-parallax-image src={gallery[0]?.url || p.coverImageUrl} alt={gallery[0]?.altText || p.heroAltText || p.name} />
          <small>[Insert Full-Bleed Image: {p.name} hero interior showing the principal spatial idea and primary material language.]</small>
        </section>

        <section className={styles.story}>
          <div><p className={styles.kicker}>02 · THE SPATIAL CHALLENGE</p><h2>The Spatial Challenge</h2></div>
          <p>{p.spatialChallenge || p.challenge}</p>
        </section>

        <section className={styles.story}>
          <div><p className={styles.kicker}>03 · THE CRAFTED SOLUTION</p><h2>The Crafted Solution</h2></div>
          <p>{p.craftedSolution || p.solution}</p>
        </section>

        {beforeItem?.url && afterItem?.url && <section className={styles.beforeAfter}>
          <div className={styles.beforeAfterHead}><p className={styles.kicker}>BEFORE / AFTER</p><h2>See the intervention as a transformation.</h2><p>Drag the control to compare the original condition with the completed interior.</p></div>
          <div className={styles.compare}>
            <img src={afterItem.url} alt={afterItem.altText || p.name + " completed interior"} />
            <div className={styles.beforeLayer} style={{width: comparison + "%"}}><img src={beforeItem.url} alt={beforeItem.altText || p.name + " original condition"} /></div>
            <span className={styles.beforeLabel}>BEFORE</span><span className={styles.afterLabel}>AFTER</span>
            <input className={styles.compareRange} type="range" min="0" max="100" value={comparison} onChange={e=>setComparison(Number(e.target.value))} aria-label="Compare before and after images" />
            <div className={styles.compareHandle} style={{left: comparison + "%"}} aria-hidden="true"></div>
          </div>
        </section>}

        {gallery.slice(1).map((item: any, i: number) => (
          <figure className={i % 2 === 0 ? styles.galleryWide : styles.galleryDetail} key={item.url + "-" + i} data-parallax-container>
            <img data-parallax-image src={item.url} alt={item.altText || p.name + " interior detail"} />
            <figcaption>{item.caption || "[Insert Editorial Image: " + p.name + " material and detailing study.]"}</figcaption>
          </figure>
        ))}

        <ProjectReviews projectId={String(p.id)} />

        <section className={styles.directives}>
          <p className={styles.kicker}>IMAGE ASSET PLAN</p>
          <h2>Documentation follows the same hierarchy as the design.</h2>
          <div>
            <p>[Insert Full-Bleed Image: principal room with the strongest architectural view.]</p>
            <p>[Insert Detail Image: custom joinery, stone, metal or textile junction photographed close enough to reveal execution.]</p>
            <p>[Insert Portrait/Vertical Image: secondary room or transition space showing spatial flow.]</p>
            <p>[Insert Before/After Slider: original condition versus completed intervention where restoration or transformation is central to the story.]</p>
          </div>
        </section>
      </main>

      <footer className={styles.next}>
        <Link to="/portfolio">← Back to all projects</Link>
        <Link to="/contact">Discuss a similar commission ↗</Link>
      </footer>
    </SiteLayout>
  );
}