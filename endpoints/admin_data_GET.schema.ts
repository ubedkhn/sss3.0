import superjson from "superjson";
export type OutputType={inquiries:Array<any>;projects:Array<any>;posts:Array<any>;reviews:Array<any>};
export const getAdminData=async(init?:RequestInit):Promise<OutputType>=>{
  const r=await fetch("/_api/admin_data",{method:"GET",credentials:"include",cache:"no-store",...init});
  if(!r.ok){
    let message="Could not load admin data";
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