import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import styles from "./SiteLayout.module.css";

const links = [
  ["/", "Home"],
  ["/portfolio", "Portfolio"],
  ["/services", "Services"],
  ["/process", "Process"],
  ["/about", "About Us"],
  ["/journal", "Journal"],
] as const;

export default function SiteLayout({children, overlayHeader = false}:{children:React.ReactNode; overlayHeader?: boolean}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;
    const selectors = [":scope > section",":scope > header",":scope > nav","[data-reveal]","article",".sectionHead",".project",".serviceGrid article",".processList article",".whyGrid p"];
    const nodes = Array.from(root.querySelectorAll(selectors.join(",")));
    nodes.forEach((node, index) => {
      if (!(node instanceof HTMLElement) || node.closest("[data-no-reveal]")) return;
      node.classList.add(styles.reveal);
      node.style.setProperty("--reveal-delay", (Math.min(index % 6, 5) * 70) + "ms");
    });
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(node => node.classList.add(styles.revealed));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        }
      });
    }, {rootMargin:"0px 0px -8% 0px", threshold:.08});
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [children]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
        "@id": "https://shrishwariyasethinteriors.com/#business",
        "name": "Shri Sawariya Seth Interior Designs",
        "alternateName": ["Shri Sawariya Seth Interior Designer", "Shri Shwariya Seth Interior Designs", "Shri Shwariya Seth Interior Designer"],
        "url": "https://shrishwariyasethinteriors.com/",
        "telephone": "+919074530701",
        "description": "Interior design studio serving residential and commercial spaces across Indore, Dewas, Bhopal, Ujjain and surrounding Madhya Pradesh areas.",
        "priceRange": "Project-specific",
        "areaServed": [
          {"@type":"City","name":"Indore"},
          {"@type":"City","name":"Dewas"},
          {"@type":"City","name":"Bhopal"},
          {"@type":"City","name":"Ujjain"},
          {"@type":"AdministrativeArea","name":"Madhya Pradesh"},
          {"@type":"Country","name":"India"},
          {"@type":"Place","name":"Bhorasa"},
          {"@type":"Place","name":"Sonkatch"},
          {"@type":"Place","name":"Pushpgiri"},
          {"@type":"Place","name":"Rajoda"}
        ],
        "knowsAbout": [
          "Interior design",
          "Residential interior design",
          "Flat and apartment interiors",
          "Villa and independent house interiors",
          "Modular kitchen design",
          "Bedroom interiors",
          "Living room interiors",
          "Pooja room interiors",
          "Retail and shop interiors",
          "Corporate office interiors",
          "Cafe and restaurant interiors",
          "Cloud kitchen interiors",
          "Boutique hotel interiors",
          "Turnkey interior execution",
          "Renovation and remodeling",
          "Budget interior design",
          "Luxury residential execution",
          "Commercial interior design in Madhya Pradesh"
        ],
        "keywords": "Shri Sawariya Seth Interior Designs, Shri Sawariya Seth Interior Designer, interior designer in Indore, interior designer in Dewas, interior design services in Bhopal, interior designers in MP, Madhya Pradesh design studio, budget interior designers in Indore, affordable luxury home interiors Indore, turnkey interior packages MP, best interior designer in India",
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://shrishwariyasethinteriors.com/#website",
        "url": "https://shrishwariyasethinteriors.com/",
        "name": "Shri Sawariya Seth Interior Designs",
        "publisher": {"@id":"https://shrishwariyasethinteriors.com/#business"},
        "inLanguage": "en-IN"
      }
    ]
  };
  return <div className={styles.shell}>
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
    <header className={styles.header + " " + (overlayHeader ? styles.overlayHeader : "")}>
      <Link to="/" className={styles.brand} onClick={() => setMenuOpen(false)}>
        <span>SHRI SAWARIYA SETH</span><small>INTERIOR DESIGNS</small>
      </Link>
      <nav className={styles.nav} aria-label="Primary navigation">
        {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
      </nav>
      <div className={styles.headerActions}>
        <a href="tel:+919074530701" className={styles.phoneLink} aria-label="Call the studio at 90745 30701">Call <span>+91 90745 30701</span></a>
        <Link to="/contact" className={styles.contact}>Enquire <span>↗</span></Link>
        <button type="button" className={styles.menuButton} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}>
          <span>{menuOpen ? "Close" : "Menu"}</span><i aria-hidden="true">{menuOpen ? "×" : "＋"}</i>
        </button>
      </div>
    </header>
    {menuOpen && <div id="mobile-navigation" className={styles.mobileMenu}>
      <p>EXPLORE THE STUDIO</p>
      <nav aria-label="Mobile navigation">
        {links.map(([to, label], index) => <Link key={to} to={to} onClick={() => setMenuOpen(false)}>
          <span>0{index + 1}</span><strong>{label}</strong><em>↗</em>
        </Link>)}
      </nav>
      <Link to="/contact" className={styles.mobileEnquire} onClick={() => setMenuOpen(false)}>Begin an enquiry <span>↗</span></Link>
    </div>}
    <main>{children}</main>
    <a className={styles.whatsapp} href="https://wa.me/919074530701?text=Hello%20Shri%20Sawariya%20Seth%20Interior%20Designs%2C%20I%20would%20like%20to%20discuss%20an%20interior%20project." aria-label="Chat on WhatsApp with Shri Sawariya Seth Interior Designs"><span>WhatsApp</span><b>↗</b></a>
    <footer className={styles.footer}>
      <div className={styles.footerIntro}><div className={styles.footerBrand}>SHRI SAWARIYA SETH</div><p>Interior architecture and design for considered homes across Madhya Pradesh.</p></div>
      <div className={styles.footerLinks}><p>EXPLORE</p>{links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}<Link to="/contact">Contact / Enquire</Link><a href="tel:+919074530701">Call +91 90745 30701 ↗</a></div>
      <div className={styles.footerMeta}><span>Indore · Bhopal · Dewas · Ujjain</span><span>Madhya Pradesh, India</span><span>© {new Date().getFullYear()} Shri Sawariya Seth Interior Designs</span></div>
    </footer>
  </div>;
}