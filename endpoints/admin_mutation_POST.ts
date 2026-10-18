import {schema} from "./admin_mutation_POST.schema";
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
  const session=await getServerUserSession(request);
  if(session.user.role!=="admin")return new Response(superjson.stringify({error:"Admin access required"}),{status:403,headers:privateHeaders});
  const input=schema.parse(superjson.parse(await request.text()));
 if(input.action==="update_inquiry"){await db.updateTable("inquiries").set({status:input.status}).where("id","=",input.id).execute()}
 else if(input.action==="delete_review"){await db.deleteFrom("projectReviews").where("id","=",input.id).execute()}
 else if(input.action==="create_project"||input.action==="update_project"){
  const values={name:input.name,slug:input.slug,location:input.location,projectType:input.projectType,category:input.category,year:input.year,squareFootage:input.squareFootage??null,clientBrief:input.clientBrief,challenge:input.spatialChallenge,vision:input.vision,spatialChallenge:input.spatialChallenge,solution:input.craftedSolution,craftedSolution:input.craftedSolution,narrative:input.craftedSolution,coverImageUrl:input.coverImageUrl||null,heroVideoUrl:input.heroVideoUrl||null,heroAltText:input.heroAltText,galleryItems:input.galleryItems,beforeAfterItems:input.beforeAfterItems, galleryUrls:input.galleryItems.map((x:any)=>x.url).filter(Boolean),videoUrls:input.heroVideoUrl?[input.heroVideoUrl]:[],seoTitle:input.seoTitle||null,seoDescription:input.seoDescription||null,published:input.published,updatedAt:new Date()};
  if(input.action==="create_project") await db.insertInto("projects").values(values).execute(); else await db.updateTable("projects").set(values).where("id","=",input.id).execute()
 }
 else if(input.action==="delete_project"){await db.deleteFrom("projects").where("id","=",input.id).execute()}
 else if(input.action==="create_journal"){await db.insertInto("journalPosts").values({title:input.title,slug:input.slug,excerpt:input.excerpt,body:input.body,coverImageUrl:input.coverImageUrl||null,published:input.published,publishedAt:input.published?new Date():null}).execute()}
 else{await db.updateTable("journalPosts").set({title:input.title,slug:input.slug,excerpt:input.excerpt,body:input.body,coverImageUrl:input.coverImageUrl||null,published:input.published,publishedAt:input.published?new Date():null,updatedAt:new Date()}).where("id","=",input.id).execute()}
 return new Response(superjson.stringify({success:true}),{headers:privateHeaders});
 }catch(error){
  if(error instanceof NotAuthenticatedError)return new Response(superjson.stringify({error:"Authentication required"}),{status:401,headers:privateHeaders});
  return new Response(superjson.stringify({error:error instanceof Error?error.message:"Invalid admin action"}),{status:400,headers:privateHeaders});
 }
}