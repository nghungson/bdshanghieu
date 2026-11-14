import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
for(const dir of ['src','public','scripts'])for(const f of readdirSync(dir)){if(f.endsWith('.js'))execFileSync(process.execPath,['--check',dir+'/'+f],{stdio:'pipe'});}
for(const f of ['package.json','vercel.json','content/settings.json','content/demo-properties.json'])JSON.parse(readFileSync(f,'utf8'));
const app=readFileSync('public/app.js','utf8');assert(!app.includes('script.google.com'));assert(!app.includes('GOOGLE_APPS_SCRIPT_SECRET'));
for(const name of ['index.html','product.html']){const t=readFileSync('templates/'+name,'utf8');assert(!existsSync('public/'+name));assert(t.includes('lang="vi"'));}
for(const f of ['.env','Code.gs','Google-Apps-Script.txt','cms-fields.json'])assert(!existsSync('public/'+f));
console.log('Source syntax, JSON configuration, template isolation and client-secret checks passed.');
