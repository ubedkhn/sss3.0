import {Helmet} from "react-helmet"; import SiteLayout from "../components/SiteLayout"; import styles from "./process.module.css";
const phases=[
 ["01","Consultation & Conceptualization","We begin with the brief: how the home should work, what matters to you, what must change and what should remain. The result is a clear creative direction, scope and fee before detailed work begins."],
 ["02","Detailed Design & Materialization","Plans become decisions. We develop furniture layouts, elevations, lighting, finishes and material palettes so every important choice is documented before procurement or site execution."],
 ["03","Procurement & Project Management","The studio coordinates approved vendors, custom pieces and material orders while maintaining the design intent. Decisions are tracked, dependencies surfaced early and changes kept deliberate."],
 ["04","Installation & The Grand Reveal","The final stage is about precision. Furniture, lighting, art and accessories are installed in sequence, with the studio overseeing the last details until the residence reads as one complete composition."]
];
export default function Process(){return <SiteLayout><Helmet><title>Process | Shri Sawariya Seth</title></Helmet>
<section className={styles.intro}><div className={styles.progressVisual} aria-hidden="true"><div className={styles.progressTrack}><span></span></div>{phases.map(p=><i key={p[0]}></i>)}</div><p>THE PROCESS</p><h1>Fewer surprises. Better decisions.</h1><span>A structured four-phase process designed to protect your time, attention and investment.</span></section>
<section className={styles.timeline}>{phases.map((p,i)=><article className={styles.phase} key={p[0]}><div className={styles.marker}><span>{p[0]}</span><i></i></div><div className={styles.phaseCopy}><h2>{p[1]}</h2><p>{p[2]}</p></div><div className={styles.phaseGraphic} aria-hidden="true"><div><span></span><span></span><span></span><b>{String(i+1).padStart(2,"0")}</b></div></div></article>)}</section>
<section className={styles.closing}><p>FROM FIRST BRIEF TO FINAL REVEAL</p><h2>Every phase has a purpose. Every decision moves the home forward.</h2></section>
</SiteLayout>}