import {createHash} from 'node:crypto';
export function validateLead(body){
 if(!body||typeof body!=='object'||Array.isArray(body))throw Error('INVALID_INPUT');
 const str=(k,n)=>{if(typeof body[k]!=='string'||body[k].trim().length>n)throw Error('INVALID_INPUT');return body[k].trim();};
 if(body.website)throw Error('SPAM');
 const name=str('name',100),phone=str('phone',30).replace(/[\s()-]/g,''),needs=str('needs',3000),requestId=str('requestId',80),email=body.email?str('email',200):'';
 const intent=str('intent',100),budget=str('budget',100);
 if(name.length<2||needs.length<3||!/^\+?\d{9,15}$/.test(phone)||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)||body.consent!==true)throw Error('INVALID_INPUT');
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('INVALID_INPUT');
 const fingerprint=createHash('sha256').update(JSON.stringify({name,phone,email,intent,budget,needs})).digest('hex');
 return {name,phone,email,intent,budget,needs,requestId,consent:true,fingerprint};
}
export async function verifyTurnstile(token,config,fetcher=fetch){
 if(!config.requireTurnstile)return true;
 if(typeof token!=='string'||token.length<1||token.length>2048)return false;
 const r=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:config.turnstileSecret,response:token}),signal:AbortSignal.timeout(8000)});
 if(!r.ok)return false;const result=await r.json();
 return result.success===true&&result.action==='lead'&&config.turnstileHosts.includes(result.hostname);
}
