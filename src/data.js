export const categories=['Thổ Cư/Nhà Phố','Hotel/Motel','Đất Vàng','Biệt Thự/Liền Kề'];
export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function imageURL(value){
 const s=String(value||'').trim();
 if(/^\/assets\/[a-zA-Z0-9_./-]+$/.test(s)&&!s.includes('..'))return s;
 try {const u=new URL(s);if(u.protocol==='https:'&&!u.username&&!u.password)return u.href;} catch{}
 return '/assets/hero.jpg';
}
export function slug(text){return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);}
export const propertyPath=p=>'/bat-dong-san/'+encodeURIComponent(p.id)+'/'+slug(p.title);
export function normalizeContent(raw,{demo=false}={}){
 if(!raw||!Array.isArray(raw.properties))throw new Error('INVALID_CONTENT');
 const seen=new Set();const properties=raw.properties.filter(p=>{
 if(!p||!/^[A-Za-z0-9_-]{1,64}$/.test(p.id||'')||seen.has(p.id)||!categories.includes(p.category)||!String(p.title||'').trim()||!Array.isArray(p.images)||p.images.length<4)return false;
 if(p.published!==undefined&&!['true','1'].includes(String(p.published).toLowerCase()))return false;
 seen.add(p.id);return true;
 }).map((p,i)=>{
 const out={};for(const key of ['id','title','category','street','ward','city','area','frontage','price','description','seo_title','seo_description','seo_keywords','og_title','og_description','og_image','created_at','tiktok_caption','legal_status','road_width','floors','bathrooms','interior','bedrooms'])out[key]=String(p[key]??'').slice(0,key==='description'?20000:1000);
 out.images=p.images.slice(0,24).map(imageURL);out.image=imageURL(p.image||p.images[0]);out.demo=demo;out._order=i;out.url=propertyPath(out);return out;
 }).sort((a,b)=>(Date.parse(b.created_at)||0)-(Date.parse(a.created_at)||0)||b._order-a._order).map(({_order,...p})=>p);
 const settings={};for(const [k,v] of Object.entries(raw.settings||{})){if(/^[a-zA-Z][a-zA-Z0-9_]{0,80}$/.test(k)&&typeof v==='string')settings[k]=v.slice(0,k==='privacy_text'?20000:5000);}
 return {properties,settings};
}
export function safeJSON(value){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
