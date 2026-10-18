import {useState} from "react";
import {Helmet} from "react-helmet";
import SiteLayout from "../components/SiteLayout";
import {postInquiry} from "../endpoints/inquiries_POST.schema";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "../components/Select";
import styles from "./contact.module.css";

const scopes=["Full-service residential","New construction collaboration","Curated styling & furnishing","Renovation / refurbishment"];
const timelines=["Under 3 months","3–6 months","6–12 months","12+ months","Flexible"];
const investments=["₹25–50 lakh","₹50 lakh–₹1 crore","₹1–2 crore","₹2 crore+","Prefer to discuss"];

export default function Contact(){
 const [sent,setSent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [scope,setScope]=useState("");
 const [timeline,setTimeline]=useState("");
 const [investment,setInvestment]=useState("");
 const [customBudget,setCustomBudget]=useState("");
 const submit=async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();setBusy(true);
  const form=e.currentTarget;
  const f=new FormData(form);
  const email=String(f.get("email")||"").trim();
  const budget=investment==="custom"?customBudget.trim():investment;
  try{
   await postInquiry({...Object.fromEntries(f.entries()),email:email||undefined,projectScope:scope,desiredTimeline:timeline,investmentRange:budget} as any);
   setSent(true);form.reset();setScope("");setTimeline("");setInvestment("");setCustomBudget("");
  }catch(err){alert(err instanceof Error?err.message:"Unable to send")}
  finally{setBusy(false)}
 };
 return <SiteLayout><Helmet><title>Contact | Shri Sawariya Seth</title></Helmet>
  <section className={styles.intro}><p>PROJECT ENQUIRIES</p><h1>Let’s establish whether the brief is right for the studio.</h1><span>We take on a limited number of projects at a time. Share the essentials below and the studio will respond with the appropriate next step.</span><a className={styles.callOption} href="tel:+919074530701"><span>Prefer to speak directly?</span><strong>Call the studio · +91 90745 30701 ↗</strong></a></section>
  <form className={styles.form} onSubmit={submit}>
   <label>Name<input name="name" required placeholder="Your full name" autoComplete="name"/></label>
   <label>Email <small>OPTIONAL</small><input name="email" type="email" placeholder="you@example.com" autoComplete="email"/></label>
   <label>Phone<input name="phone" type="tel" placeholder="+91" autoComplete="tel"/></label>
   <label>Project scope<div className={styles.selectWrap}><Select value={scope} onValueChange={setScope} name="projectScope" required><SelectTrigger aria-label="Project scope"><SelectValue placeholder="Select scope"/></SelectTrigger><SelectContent position="popper" sideOffset={6}>{scopes.map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div></label>
   <label>Geographic location<input name="geographicLocation" required placeholder="City, Madhya Pradesh" autoComplete="address-level2"/></label>
   <label>Desired timeline<div className={styles.selectWrap}><Select value={timeline} onValueChange={setTimeline} name="desiredTimeline" required><SelectTrigger aria-label="Desired timeline"><SelectValue placeholder="Select timeline"/></SelectTrigger><SelectContent position="popper" sideOffset={6}>{timelines.map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent></Select></div></label>
   <label>Estimated investment<div className={styles.selectWrap}><Select value={investment} onValueChange={setInvestment} name="investmentRange" required><SelectTrigger aria-label="Estimated investment"><SelectValue placeholder="Select range"/></SelectTrigger><SelectContent position="popper" sideOffset={6}>{investments.map(x=><SelectItem key={x} value={x}>{x}</SelectItem>)}<SelectItem value="custom">Enter budget manually</SelectItem></SelectContent></Select></div>{investment==="custom"&&<input className={styles.customBudget} value={customBudget} onChange={e=>setCustomBudget(e.target.value)} required placeholder="Enter your approximate budget (e.g. ₹35 lakh)"/>}</label>
   <label className={styles.full}>Project notes<textarea name="message" rows={6} placeholder="Tell us about the property, scope and what you are hoping to achieve."/></label>
   <button disabled={busy|| (investment==="custom"&&!customBudget.trim())}>{busy?"Sending…":sent?"Enquiry received":"Send project enquiry ↗"}</button>
   <p className={styles.formNote}>Email is optional. Your phone number helps us follow up on your enquiry.</p>
  </form>
 </SiteLayout>
}