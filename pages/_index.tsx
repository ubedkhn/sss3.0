import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";
import styles from "./_index.module.css";

const projects = [
  { image: "https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/aaadf1f6-e759-4637-8a6c-b056339a0a99.png", city: "Indore", type: "Residential", name: "The Aravali Residence", href: "/portfolio" },
  { image: "https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/648c2d32-797a-4278-8627-df4a973b6da8.png", city: "Bhopal", type: "Residential", name: "The Lake House", href: "/portfolio" },
  { image: "https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/e9236422-85dd-476b-98c3-a917f21d76e4.png", city: "Dewas", type: "Residential", name: "The Dewas Residence", href: "/portfolio/the-dewas-residence" },
  { image: "https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/1e3667ba-7b34-4f2f-b307-068fb6410ab6.png", city: "Ujjain", type: "New Build", name: "The Ujjain Courtyard House", href: "/portfolio/the-ujjain-courtyard-house" },
];

const services = [
  ["01", "Homes, Flats & Villas", "Complete residential interiors for 1BHK, 2BHK, 3BHK, penthouses, villas and independent houses."],
  ["02", "Kitchens, Bedrooms & Living Rooms", "Room-specific design for modular kitchens, wardrobes, bedrooms, living rooms and pooja spaces."],
  ["03", "Shops & Retail Interiors", "Boutiques, jewellery stores, salons, grocery marts and customer-facing retail environments."],
  ["04", "Offices, Cafes & Hospitality", "Corporate offices, co-working spaces, cafes, restaurants, cloud kitchens and boutique hospitality."],
  ["05", "Renovation & Remodeling", "Existing-space upgrades with careful planning around structure, services, finishes and furniture."],
  ["06", "Turnkey Execution", "Procurement, fabrication, vendor coordination and site supervision through one accountable design direction."],
];

const process = [
  ["01", "Consultation & Site Study", "We understand the property, location, brief, existing conditions, timeline and practical requirements."],
  ["02", "Concept & 3D Design", "Plans, moodboards, material palettes and 3D views establish the design direction before execution."],
  ["03", "Materials & Cost Planning", "Scope, specifications, finishes and budget priorities are discussed before work moves to site."],
  ["04", "Execution & Supervision", "Procurement, fabrication and site coordination are monitored against the agreed design."],
  ["05", "Final Handover", "Installation, styling and finishing are reviewed before the completed space is handed over."],
];

const serviceAreas = ["Indore", "Dewas", "Bhopal", "Ujjain", "Bhorasa", "Sonkatch", "Pushpgiri", "Rajoda"];

export default function Home() {
 return <SiteLayout overlayHeader>
  <Helmet>
   <title>Interior Designers in Indore, Dewas & Madhya Pradesh | Shri Sawariya Seth Interior Designs</title>
   <meta name="description" content="Interior design and turnkey execution for homes, flats, villas, kitchens, bedrooms, living rooms, shops, offices, cafes and commercial spaces across Indore, Dewas, Bhopal, Ujjain and Madhya Pradesh."/>
   <meta name="keywords" content="Shri Sawariya Seth Interior Designs, Shri Sawariya Seth Interior Designer, interior designer in Indore, interior designer in Dewas, interior design Bhopal, interior designers Madhya Pradesh, home interiors Indore, shop interior designer Indore, modular kitchen Dewas, turnkey interior packages MP, commercial interior design MP"/>
  </Helmet>

  <section className={styles.hero}>
   <div className={styles.heroImage} aria-hidden="true"><img src="https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/9b0dffa5-f629-4564-b839-f08833494bf3.png" alt="Interior design by Shri Sawariya Seth Interior Designs in Madhya Pradesh"/></div>
   <div className={styles.heroOverlay} aria-hidden="true"></div>
   <div className={styles.heroCopy}>
    <p className={styles.kicker}>INTERIOR DESIGN · RESIDENTIAL · COMMERCIAL · MADHYA PRADESH</p>
    <h1>Interiors for homes, rooms and businesses.</h1>
    <p className={styles.lede}>From flats and villas to kitchens, bedrooms, shops, offices, cafes and hospitality spaces, we design complete interiors around how each space needs to work.</p>
    <p className={styles.proof}>3D DESIGN <span>•</span> COST PLANNING <span>•</span> MATERIAL SELECTION <span>•</span> SITE SUPERVISION</p>
    <div className={styles.actions}><Link to="/contact">Schedule Design Consultation <span>↗</span></Link><Link to="/portfolio">Explore Our Work <span>↗</span></Link></div>
    <p className={styles.note}>Indore · Dewas · Bhopal · Ujjain · surrounding MP areas</p>
   </div>
  </section>

  <section className={styles.trust}>
   <div><strong>Residential</strong><span>Flats · Villas · Independent Houses · Penthouses</span></div>
   <div><strong>Room Interiors</strong><span>Kitchens · Bedrooms · Living Rooms · Pooja Rooms</span></div>
   <div><strong>Commercial</strong><span>Shops · Offices · Cafes · Restaurants · Hospitality</span></div>
   <div><strong>Local Coverage</strong><span>Indore · Dewas · Bhopal · Ujjain · nearby towns & rural areas</span></div>
  </section>

  <section className={styles.localIntro}>
   <div><p className={styles.eyebrow}>INTERIOR DESIGN IN MADHYA PRADESH</p><h2>One studio for residential, commercial and room-specific interiors.</h2></div>
   <div>
    <p>We are not limited to apartment interiors. Our scope covers the individual spaces people use every day and the commercial environments where customers, teams and guests experience a business.</p>
    <p>Our primary service region is Madhya Pradesh, with a strong focus on Indore and Dewas and project coverage extending to Bhopal, Ujjain and nearby areas including Bhorasa, Sonkatch, Pushpgiri and Rajoda.</p>
    <Link to="/services">Explore the full scope of work ↗</Link>
   </div>
  </section>

  <section className={styles.projects}>
   <div className={styles.sectionHead}><div><p className={styles.eyebrow}>PORTFOLIO · LOCAL CONTEXT</p><h2>Selected work</h2></div><Link to="/portfolio">View all projects ↗</Link></div>
   <div className={styles.projectGrid}>{projects.map((project,index)=><Link to={project.href} className={styles.project} key={project.name}><div className={styles.projectImage}><img src={project.image} alt={project.name + " interior design project in " + project.city}/><span>0{index+1}</span></div><div className={styles.projectMeta}><div><span>{project.city}</span><span>{project.type}</span></div><h3>{project.name}</h3><p>View project details ↗</p></div></Link>)}</div>
  </section>

  <section className={styles.services}>
   <div className={styles.sectionHead}><div><p className={styles.eyebrow}>WHAT WE DESIGN</p><h2>From one room to an entire property.</h2></div><Link to="/services">See all services ↗</Link></div>
   <div className={styles.serviceGrid}>{services.map(s=><article key={s[0]}><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p></article>)}</div>
  </section>

  <section className={styles.process}>
   <div className={styles.processIntro}><p className={styles.eyebrow}>PROCESS & TIMELINES</p><h2>Clear decisions before execution.</h2><p>Every project receives a defined scope and execution plan. Timelines depend on the property, scale, approvals and material lead times, so we agree the delivery schedule around the actual brief rather than publish an unsupported blanket promise.</p><Link to="/process">See the complete process ↗</Link></div>
   <div className={styles.processList}>{process.map(p=><article key={p[0]}><span>{p[0]}</span><div><h3>{p[1]}</h3><p>{p[2]}</p></div></article>)}</div>
  </section>

  <section className={styles.why}>
   <p className={styles.eyebrow}>BUDGET & EXECUTION</p>
   <div><h2>Design direction that respects the budget as carefully as the aesthetic.</h2><div className={styles.whyGrid}>
    <p><strong>01 · Scope first</strong>We define what is included before material and execution decisions are made.</p>
    <p><strong>02 · Flexible project scale</strong>From focused room upgrades to complete turnkey interiors, scope is built around the property.</p>
    <p><strong>03 · Premium without unnecessary waste</strong>Material selections are discussed for proportion, durability, maintenance and the intended visual result.</p>
    <p><strong>04 · Transparent conversation</strong>For exact pricing, we review the property, scope and budget rather than publish misleading one-size-fits-all packages.</p>
   </div></div>
  </section>

  <section className={styles.areas}>
   <p className={styles.eyebrow}>AREAS WE SERVE</p><h2>Indore · Dewas · Bhopal · Ujjain</h2>
   <p>Also available for suitable projects in Bhorasa, Sonkatch, Pushpgiri, Rajoda and surrounding Madhya Pradesh areas.</p>
   <div className={styles.areaList}>{serviceAreas.map(area=><span key={area}>{area}</span>)}</div>
   <Link to="/contact">Tell us about your property ↗</Link>
  </section>

  <section className={styles.cta}>
   <p className={styles.eyebrow}>START A PROJECT</p><h2>Home, shop, kitchen or commercial space?</h2>
   <p>Tell us the location, property type, approximate scope and budget. We will guide you to the right design and execution route.</p>
   <div className={styles.ctaActions}><Link to="/contact">Request a consultation ↗</Link><a href="https://wa.me/919074530701?text=Hello%20Shri%20Sawariya%20Seth%20Interior%20Designs%2C%20I%20would%20like%20to%20discuss%20an%20interior%20project.">Chat on WhatsApp ↗</a></div>
  </section>
 </SiteLayout>;
}