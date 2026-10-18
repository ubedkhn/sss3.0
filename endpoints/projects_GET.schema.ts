import superjson from "superjson";
export type OutputType={projects:Array<any>};
export const getProjects=async(init?:RequestInit):Promise<OutputType>=>{const r=await fetch("/_api/projects",{method:"GET",...init});if(!r.ok)throw new Error((await r.text())||"Could not load projects");return superjson.parse<OutputType>(await r.text());};