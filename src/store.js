import {readFileSync} from 'node:fs';
import {normalizeContent} from './data.js';
export const defaultSettings=JSON.parse(readFileSync(new URL('../content/settings.json',import.meta.url),'utf8'));
const demoProperties=JSON.parse(readFileSync(new URL('../content/demo-properties.json',import.meta.url),'utf8'));
export function createGateway(config,fetcher=fetch){
 async function call(action,payload={}){
  if(!config.endpoint||!config.secret)throw Error('CRM_NOT_CONFIGURED');
  const r=await fetcher(config.endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,secret:config.secret,...payload}),redirect:'follow',signal:AbortSignal.timeout(18000)});
  if(!r.ok)throw Error('CRM_UNAVAILABLE');
  const text=await r.text();if(text.length>4000000)throw Error('CONTENT_TOO_LARGE');
  let data;try{data=JSON.parse(text)}catch{throw Error('CRM_INVALID_RESPONSE')}
  if(!data.ok){const e=Error(data.code==='RATE_LIMIT'?'RATE_LIMIT':'CRM_REJECTED');throw e;}return data;
 }
 return {content:()=>call('content'),lead:payload=>call('lead',{lead:payload})};
}
export function createContentStore(config,gateway){
 let cached,expiry=0,inflight;
 return {async get(){
  if(config.demo)return normalizeContent({properties:demoProperties,settings:defaultSettings},{demo:true});
  if(cached&&Date.now()<expiry)return cached;
  if(!inflight)inflight=(async()=>{const remote=await gateway.content();const normalized=normalizeContent(remote);cached={...normalized,settings:{...defaultSettings,...normalized.settings}};expiry=Date.now()+config.contentTTL;return cached;})().finally(()=>{inflight=null});
  // No silent demo or stale-price fallback when a real CRM fails.
  return inflight;
 }};
}
