export function readConfig(env=process.env){
 const demo=env.DEMO_MODE!=='false',indexable=env.INDEXABLE==='true';
 const origin=new URL(env.SITE_URL||'http://localhost:3000');
 if(!['http:','https:'].includes(origin.protocol)||origin.pathname!=='/'||origin.search||origin.hash)throw Error('SITE_URL phải là origin, ví dụ https://www.bdshanghieu.net');
 const isProduction=env.NODE_ENV==='production';
 if(indexable&&(demo||!env.GOOGLE_APPS_SCRIPT_URL||!env.GOOGLE_APPS_SCRIPT_SECRET))throw Error('INDEXABLE yêu cầu kho hàng thật và cấu hình Google Sheets');
 if(isProduction&&indexable&&origin.protocol!=='https:')throw Error('Production cần HTTPS');
 if(env.GOOGLE_APPS_SCRIPT_URL&&!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(env.GOOGLE_APPS_SCRIPT_URL))throw Error('GOOGLE_APPS_SCRIPT_URL phải là URL Web App /exec');
 const requireTurnstile=isProduction||env.REQUIRE_TURNSTILE!=='false';
 if(!demo&&env.GOOGLE_APPS_SCRIPT_SECRET&&env.GOOGLE_APPS_SCRIPT_SECRET.length<32)throw Error('Secret cần ít nhất 32 ký tự');
 return {origin:origin.origin,demo,indexable,isProduction,requireTurnstile,
  endpoint:env.GOOGLE_APPS_SCRIPT_URL||'',secret:env.GOOGLE_APPS_SCRIPT_SECRET||'',
  turnstileSiteKey:env.TURNSTILE_SITE_KEY||'',turnstileSecret:env.TURNSTILE_SECRET_KEY||'',
  turnstileHosts:(env.TURNSTILE_HOSTNAMES||origin.hostname).split(',').map(s=>s.trim()).filter(Boolean),
  allowedOrigins:new Set([origin.origin,...(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean)]),
  contentTTL:60000,canonicalRedirect:env.CANONICAL_REDIRECT==='true',
  canonicalAliases:new Set(['bdshanghieu.net','www.bdshanghieu.net']),
  privacyApproved:env.PRIVACY_APPROVED==='true'
 };
}
export function leadConfigurationIssues(c){
 const issues=[];
 if(c.demo)issues.push('DEMO_MODE must be false');
 if(!c.privacyApproved)issues.push('PRIVACY_APPROVED must be true');
 if(!c.endpoint)issues.push('GOOGLE_APPS_SCRIPT_URL is missing');
 if(!c.secret)issues.push('GOOGLE_APPS_SCRIPT_SECRET is missing');
 if(c.requireTurnstile&&!c.turnstileSiteKey)issues.push('TURNSTILE_SITE_KEY is missing');
 if(c.requireTurnstile&&!c.turnstileSecret)issues.push('TURNSTILE_SECRET_KEY is missing');
 return issues;
}
export function leadsReady(c){return leadConfigurationIssues(c).length===0;}
