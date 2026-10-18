import {Helmet} from "react-helmet";
import {useQuery} from "@tanstack/react-query";
import SiteLayout from "../components/SiteLayout";
import {getJournal} from "../endpoints/journal_GET.schema";
import {useLuxuryMotion} from "../helpers/useLuxuryMotion";
import styles from "./journal.module.css";
export default function Journal(){
  const q=useQuery({queryKey:["journal"],queryFn:getJournal});
  useLuxuryMotion("journal-"+(q.data?.posts?.length||0));
  return <SiteLayout>
    <Helmet><title>Journal | Interior Design Notes | Shri Sawariya Seth</title><meta name="description" content="Interior design notes on Indian materials, proportion, lighting, kitchens, living spaces and practical design decisions from Shri Sawariya Seth Interior Designs." /></Helmet>
    <section className={styles.intro}><div><p>THE JOURNAL</p><h1>Notes on living well, specifying carefully and designing for time.</h1></div><div className={styles.introImage} data-parallax-container><img data-parallax-image src="https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/154bd996-db2e-4508-bcf7-c95f8b1ecb4f.png" alt="Indian interior materials and natural light detail"/></div></section>
    <section className={styles.pillars}><article data-tilt-card><span>01</span><h2>Material Intelligence</h2><p>Stone, timber, plaster, metal and textiles considered for touch, ageing, maintenance and light.</p></article><article data-tilt-card><span>02</span><h2>Proportion & Scale</h2><p>Practical guidance on room dimensions, furniture scale and the relationships that make an Indian home feel composed.</p></article><article data-tilt-card><span>03</span><h2>Architectural Light</h2><p>How layered daylight and artificial light can alter mood, circulation and the perception of material.</p></article></section>
    {q.isFetching&&<p className={styles.loading}>Loading notes…</p>}
    {!q.isFetching&&q.data?.posts.map((post:any,index:number)=><section className={styles.article} key={post.id}><div><p>JOURNAL NOTE · {String(index+1).padStart(2,"0")}</p><h2>{post.title}</h2><p>{post.excerpt}</p><a href="/contact">Discuss a project ↗</a></div><div className={styles.articleImage} data-parallax-container><img data-parallax-image src={post.coverImageUrl||"https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/154bd996-db2e-4508-bcf7-c95f8b1ecb4f.png"} alt={post.title+" interior design journal image"}/></div></section>)}
    {!q.isFetching&&(!q.data?.posts||q.data.posts.length===0)&&<section className={styles.editorial}><p>COMING INTO FOCUS</p><h2>Design notes will live here as the studio archive grows.</h2><span>The journal is structured for practical, locally relevant writing about Indian interiors rather than generic trend content.</span></section>}
  </SiteLayout>
}