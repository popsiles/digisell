import{mkdir,writeFile}from"node:fs/promises";
const site="https://prylora.netlify.app";
const supabase="https://qpvnfpbzhrszhgukmqpb.supabase.co";
const key="sb_publishable__5MvrK_ufbeKAfl87Ma1gA_wTSp8r2l";
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const today=new Date().toISOString().slice(0,10);
const urls=[{loc:site+"/",priority:"1.0"}];
try{const r=await fetch(supabase+"/rest/v1/products?select=id&published=eq.true",{headers:{apikey:key,Accept:"application/json"}});if(r.ok){const products=await r.json();for(const p of products)urls.push({loc:site+"/product/"+encodeURIComponent(p.id),priority:"0.7"})}else console.warn("Could not fetch published products for sitemap:",r.status)}catch(e){console.warn("Sitemap product lookup skipped:",e.message)}
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+esc(u.loc)+'</loc><lastmod>'+today+'</lastmod><priority>'+u.priority+'</priority></url>').join("\n")+"\n</urlset>\n";
await mkdir("dist",{recursive:true});await writeFile("dist/sitemap.xml",xml);console.log("Sitemap created with",urls.length,"URLs.");
