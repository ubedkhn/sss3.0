import {useState} from "react";
import {useQuery,useQueryClient} from "@tanstack/react-query";
import {Helmet} from "react-helmet";
import {getAdminData} from "../endpoints/admin_data_GET.schema";
import {postAdminMutation} from "../endpoints/admin_mutation_POST.schema";
import {Input} from "../components/Input";
import {Textarea} from "../components/Textarea";
import {Button} from "../components/Button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "../components/Select";
import {useAuth} from "../helpers/useAuth";
import {useNavigate} from "react-router-dom";
import styles from "./admin.module.css";

const types=["Residential","Commercial","Kitchens","Living Rooms","Retail & Shops","Offices","Hospitality","New Builds","Restoration"];
const blank={name:"",slug:"",location:"",projectType:"Residential",year:new Date().getFullYear(),squareFootage:"",clientBrief:"",vision:"",spatialChallenge:"",craftedSolution:"",coverImageUrl:"",heroVideoUrl:"",heroAltText:"",galleryText:"",beforeAfterText:"",seoTitle:"",seoDescription:"",published:false};
const galleryToText=(items:any[])=>Array.isArray(items)?items.map(x=>[x.url,x.altText||"",x.caption||"",x.layout||"full-bleed"].join(" | ")).join("\n"):"";
const parseMedia=(value:string)=>value.split("\n").map(line=>line.trim()).filter(Boolean).map(line=>{const [url,altText="",caption="",layout="full-bleed"]=line.split("|").map(s=>s.trim());return {url,altText,caption,layout};}).filter(x=>x.url);

export default function Admin(){
 const qc=useQueryClient(); const navigate=useNavigate(); const {authState,logout}=useAuth(); const q=useQuery({queryKey:["admin-data"],queryFn:getAdminData,retry:false,enabled:authState.type==="authenticated"&&authState.user.role==="admin"}); const [editing,setEditing]=useState<string|null>(null); const [draft,setDraft]=useState<any>(blank); const [saving,setSaving]=useState(false);
 if(authState.type==="loading")return <div className={styles.loading}>Checking secure admin session…</div>;
 if(authState.type==="unauthenticated"){navigate("/login",{replace:true});return <div className={styles.loading}>Redirecting to secure sign in…</div>;}
 if(authState.user.role!=="admin")return <div className={styles.loading}>This account is not authorized for the studio console.</div>;
 if(q.isLoading)return <div className={styles.loading}>Loading studio console…</div>;
 if(q.isError){
   const status=(q.error as Error & {status?:number})?.status;
   if(status===401){navigate("/login",{replace:true});return <div className={styles.loading}>Session expired. Redirecting to secure sign in…</div>;}
   if(status===403)return <div className={styles.loading}>Admin authorization required for this console.</div>;
   return <div className={styles.loading}>Unable to load the private studio data. Please refresh and try again.</div>;
 }
 const d=q.data!;
 const projectNameById=new Map((d.projects??[]).map((project:any)=>[String(project.id),project.name]));
 const updateStatus=async(id:string,status:"new"|"contacted"|"qualified"|"closed")=>{await postAdminMutation({action:"update_inquiry",id,status});await qc.invalidateQueries({queryKey:["admin-data"]})};
 const deleteReview=async(id:string)=>{if(!confirm("Delete this public review? This cannot be undone."))return;await postAdminMutation({action:"delete_review",id});await qc.invalidateQueries({queryKey:["admin-data"]})};
 const openProject=(x:any)=>{setEditing(String(x.id));setDraft({name:x.name,slug:x.slug||"",location:x.location,projectType:x.projectType||"Residential",year:x.year,squareFootage:x.squareFootage||"",clientBrief:x.clientBrief||"",vision:x.vision||"",spatialChallenge:x.spatialChallenge||x.challenge||"",craftedSolution:x.craftedSolution||x.solution||"",coverImageUrl:x.coverImageUrl||"",heroVideoUrl:x.heroVideoUrl||"",heroAltText:x.heroAltText||"",galleryText:galleryToText(x.galleryItems),beforeAfterText:galleryToText(x.beforeAfterItems),seoTitle:x.seoTitle||"",seoDescription:x.seoDescription||"",published:Boolean(x.published)});window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})};
 const saveProject=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);try{const media=parseMedia(draft.galleryText);const payload:any={action:editing==="new"?"create_project":"update_project",...draft,squareFootage:draft.squareFootage?Number(draft.squareFootage):null,galleryItems:media,beforeAfterItems:parseMedia(draft.beforeAfterText)};if(editing!=="new")payload.id=editing;await postAdminMutation(payload);setEditing(null);setDraft(blank);await qc.invalidateQueries({queryKey:["admin-data"]})}finally{setSaving(false)}};
 const deleteProject=async(id:string)=>{if(!confirm("Delete this project from the portfolio? This cannot be undone."))return;await postAdminMutation({action:"delete_project",id});await qc.invalidateQueries({queryKey:["admin-data"]})};
 const field=(label:keyof typeof blank,placeholder:string)=><label className={styles.field}><span>{String(label).replace(/[A-Z]/g,m=>` ${m}`).toUpperCase()}</span><Input value={draft[label] as string|number} onChange={e=>setDraft({...draft,[label]:e.target.value})} placeholder={placeholder}/></label>;
 return <main className={styles.app}><Helmet><title>Studio Admin | Shri Sawariya Seth</title></Helmet>
  <header><div><p>SHRI SAWARIYA SETH</p><h1>Studio Console</h1></div><div className={styles.headerActions}><a href="/">View website ↗</a><Button variant="outline" size="sm" onClick={logout}>Sign out</Button></div></header>
  <section className={styles.stats}><div><span>INQUIRIES</span><strong>{d.inquiries.length}</strong></div><div><span>PROJECTS</span><strong>{d.projects.length}</strong></div><div><span>JOURNAL</span><strong>{d.posts.length}</strong></div></section>
  <section><div className={styles.sectionHead}><p>LEAD PIPELINE</p><span>Update status directly from the table.</span></div><div className={styles.table}>{d.inquiries.map((x:any)=><article key={String(x.id)}><div><strong>{x.name}</strong><span>{x.email} · {x.geographicLocation}</span></div><div><span>{x.projectScope}</span><select value={x.status} onChange={e=>updateStatus(String(x.id),e.target.value as any)}><option>new</option><option>contacted</option><option>qualified</option><option>closed</option></select></div></article>)}</div></section>
  <section>
   <div className={styles.sectionHead}><div><p>PUBLIC REVIEWS</p><span>Every rating and comment is public. Remove individual entries from the studio console when necessary.</span></div><span>{(d.reviews??[]).length} published reviews</span></div>
   <div className={styles.reviewTable}>
    {(d.reviews??[]).map((review:any)=><article key={String(review.id)}>
      <div className={styles.reviewIdentity}><strong>{review.displayName}</strong><span>{projectNameById.get(String(review.projectId))||"Unknown project"} · {new Date(review.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span></div>
      <div className={styles.reviewRating} aria-label={review.rating+" out of 5 stars"}>{"★".repeat(review.rating)}<span>{"★".repeat(5-review.rating)}</span></div>
      <p>{review.comment}</p>
      <Button variant="destructive" size="sm" onClick={()=>deleteReview(String(review.id))}>Delete</Button>
    </article>)}
    {!(d.reviews??[]).length&&<p className={styles.emptyReviews}>No public reviews yet.</p>}
   </div>
  </section>
  <section><div className={styles.sectionHead}><div><p>PORTFOLIO CMS</p><span>One structured record generates the gallery card and the full editorial case study.</span></div><Button onClick={()=>{setEditing("new");setDraft(blank)}}>Add project ↗</Button></div>
   {editing!==null&&<form className={styles.editor} onSubmit={saveProject}>
    <div className={styles.editorHead}><div><p>{editing==="new"?"NEW PROJECT":"EDIT PROJECT"}</p><h2>{draft.name||"Untitled commission"}</h2></div><Button type="button" onClick={()=>setEditing(null)}>Close</Button></div>
    <div className={styles.group}><p className={styles.groupTitle}>01 · META DATA</p><div className={styles.formGrid}>{field("name","The Coastal Estate")}{field("slug","the-coastal-estate")}{field("location","Goa, India")}{field("year","2026")}{field("squareFootage","4,200")}
      <label className={styles.field}><span>PROJECT TYPE</span><Select value={draft.projectType} onValueChange={v=>setDraft({...draft,projectType:v})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{types.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></label></div></div>
    <div className={styles.group}><p className={styles.groupTitle}>02 · CREATIVE COPY</p><div className={styles.copyGrid}>{(["clientBrief","vision","spatialChallenge","craftedSolution"] as const).map(k=><label className={styles.field} key={k}><span>{k.replace(/[A-Z]/g,m=>` ${m}`).toUpperCase()}</span><Textarea value={draft[k]} onChange={e=>setDraft({...draft,[k]:e.target.value})} placeholder="Write the editorial project narrative…" /></label>)}</div></div>
    <div className={styles.group}><p className={styles.groupTitle}>03 · MEDIA ASSET MANAGER</p><div className={styles.formGrid}>{field("coverImageUrl","Hero image URL")}{field("heroVideoUrl","Optional hero video URL")}{field("heroAltText","SEO image description")}</div><label className={styles.field}><span>GALLERY GRID ITEMS</span><Textarea value={draft.galleryText} onChange={e=>setDraft({...draft,galleryText:e.target.value})} placeholder={'One asset per line: URL | Alt text | Caption | layout\nhttps://... | White oak living room | Principal living space | full-bleed'}/><small>Each line becomes a gallery item. Layout values: full-bleed, detail, vertical.</small></label><label className={styles.field}><span>BEFORE / AFTER SLIDER ITEMS</span><Textarea value={draft.beforeAfterText} onChange={e=>setDraft({...draft,beforeAfterText:e.target.value})} placeholder={'One asset per line: URL | Alt text | Caption | before or after'}/></label></div>
    <div className={styles.group}><p className={styles.groupTitle}>04 · SEARCH & PUBLISHING</p><div className={styles.copyGrid}>{field("seoTitle","Project title for search engines")}{field("seoDescription","150-160 character search description")}</div><label className={styles.publish}><input type="checkbox" checked={draft.published} onChange={e=>setDraft({...draft,published:e.target.checked})}/> Publish this project</label></div>
    <div className={styles.actions}><Button type="submit" disabled={saving}>{saving?"Saving…":editing==="new"?"Create project":"Save changes"}</Button><Button type="button" onClick={()=>setEditing(null)}>Cancel</Button></div>
   </form>}
   <div className={styles.cards}>{d.projects.map((x:any)=><article className={styles.card} key={String(x.id)}><img src={x.coverImageUrl||"https://f7e1eaf0-74c7-4c48-bd3a-7f925db03bf6.sandbox.floot.app/_cdn/static/2af2f21c-ec5f-4c06-8e8f-4bf594a09a9c.png"}/><div className={styles.cardBody}><div><span>{x.location}</span><span>{x.projectType||x.category}</span></div><h3>{x.name}</h3><p>{x.year} · {x.squareFootage?`${x.squareFootage.toLocaleString()} sq ft`:"Size not set"} · {x.published?"Published":"Draft"}</p><div className={styles.cardActions}><Button onClick={()=>openProject(x)}>Edit ↗</Button><Button onClick={()=>deleteProject(String(x.id))}>Delete</Button></div></div></article>)}</div>
  </section>
 </main>
}