import {z} from "zod"; import superjson from "superjson";
export const schema=z.discriminatedUnion("action",[
 z.object({action:z.literal("update_inquiry"),id:z.string(),status:z.enum(["new","contacted","qualified","closed"]) }),
 z.object({action:z.literal("delete_review"),id:z.string()}),
 z.object({action:z.literal("create_project"),name:z.string().min(2),slug:z.string().min(2),location:z.string(),projectType:z.string(),category:z.string(),year:z.coerce.number(),squareFootage:z.coerce.number().nullable().optional(),clientBrief:z.string(),vision:z.string(),spatialChallenge:z.string(),craftedSolution:z.string(),coverImageUrl:z.string().url().optional().or(z.literal("")),heroVideoUrl:z.string().url().optional().or(z.literal("")),heroAltText:z.string(),galleryItems:z.array(z.any()).default([]),beforeAfterItems:z.array(z.any()).default([]),seoTitle:z.string().optional(),seoDescription:z.string().optional(),published:z.boolean().default(false)}),
 z.object({action:z.literal("update_project"),id:z.string(),name:z.string().min(2),slug:z.string().min(2),location:z.string(),projectType:z.string(),category:z.string(),year:z.coerce.number(),squareFootage:z.coerce.number().nullable().optional(),clientBrief:z.string(),vision:z.string(),spatialChallenge:z.string(),craftedSolution:z.string(),coverImageUrl:z.string().url().optional().or(z.literal("")),heroVideoUrl:z.string().url().optional().or(z.literal("")),heroAltText:z.string(),galleryItems:z.array(z.any()).default([]),beforeAfterItems:z.array(z.any()).default([]),seoTitle:z.string().optional(),seoDescription:z.string().optional(),published:z.boolean().default(true)}),
 z.object({action:z.literal("delete_project"),id:z.string()}),
 z.object({action:z.literal("create_journal"),title:z.string().min(3),slug:z.string().min(3),excerpt:z.string().min(3),body:z.string().min(3),coverImageUrl:z.string().url().optional().or(z.literal("")),published:z.boolean().default(false)}),
 z.object({action:z.literal("update_journal"),id:z.string(),title:z.string().min(3),slug:z.string().min(3),excerpt:z.string(),body:z.string(),coverImageUrl:z.string().url().optional().or(z.literal("")),published:z.boolean()})
]);
export type InputType=z.infer<typeof schema>; export type OutputType={success:boolean};
export const postAdminMutation=async(body:InputType,init?:RequestInit):Promise<OutputType>=>{
  const r=await fetch("/_api/admin_mutation",{method:"POST",credentials:"include",body:superjson.stringify(schema.parse(body)),...init,headers:{"Content-Type":"application/json",...(init?.headers||{})}});
  if(!r.ok){
    let message="Action failed";
    try{
      const payload=superjson.parse<{error?:string;message?:string}>(await r.text());
      message=payload.error||payload.message||message;
    }catch{}
    const error=new Error(message) as Error & {status?:number};
    error.status=r.status;
    throw error;
  }
  return superjson.parse<OutputType>(await r.text());
};