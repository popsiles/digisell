import{createClient}from"@supabase/supabase-js";
// These are public Supabase connection details (safe to expose in a browser).
// Payment credentials and service-role keys must never be placed here.
const url=import.meta.env.VITE_SUPABASE_URL||"https://qpvnfpbzhrszhgukmqpb.supabase.co";
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||"sb_publishable__5MvrK_ufbeKAfl87Ma1gA_wTSp8r2l";
export const supabase=createClient(url,key);
export const api=(route,options={})=>fetch(`${url}/functions/v1/store-api/${route}`,{...options,headers:{"Content-Type":"application/json",...(options.headers||{})}});
