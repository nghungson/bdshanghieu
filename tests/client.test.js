import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {renderPage} from '../src/render.js';
import {normalizeContent} from '../src/data.js';
import {readConfig} from '../src/config.js';
import {defaultSettings} from '../src/store.js';
const code=readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const data=normalizeContent({properties:JSON.parse(readFileSync(new URL('../content/demo-properties.json',import.meta.url))),settings:defaultSettings});
function setup(t,{product=false,width=1280,live=false,fetcher}={}){
 const config=readConfig({SITE_URL:'https://www.bdshanghieu.net',DEMO_MODE:live?'false':'true',PRIVACY_APPROVED:'true',REQUIRE_TURNSTILE:'false',GOOGLE_APPS_SCRIPT_URL:'https://script.google.com/macros/s/test/exec',GOOGLE_APPS_SCRIPT_SECRET:'test-only-secret-12345678901234567890'});
 const dom=new JSDOM(renderPage({content:data,config,product:product?data.properties[0]:undefined}),{url:config.origin,runScripts:'outside-only',pretendToBeVisual:true});t.after(()=>dom.window.close());const w=dom.window,intervals=new Map();let i=0;w.innerWidth=width;w.setInterval=(f,ms)=>{intervals.set(++i,{f,ms});return i};w.clearInterval=id=>intervals.delete(id);w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};w.fetch=fetcher;w.AbortSignal=AbortSignal;w.eval(code);const q=s=>w.document.querySelector(s);return {w,q,intervals,tick:()=>[...intervals.values()].forEach(x=>x.f())};
}
test('Client: pagination, recherche et quatre filtres fonctionnent',t=>{const {q,w}=setup(t);assert.match(q('.property').href,/STN-006/);q('#collection-next').click();assert.match(q('#collection-count').textContent,/4–6/);q('#collection-prev').click();for(const c of ['Hotel/Motel','Đất Vàng','Biệt Thự/Liền Kề','Thổ Cư/Nhà Phố']){q(`[data-filter="${c}"]`).click();assert(q('.property'));assert.equal(q('.card-meta span').textContent,c)}q('[data-filter="all"]').click();q('#search').value='STN-002';q('#search').dispatchEvent(new w.Event('input'));assert.match(q('.property').href,/STN-002/);q('#search').value='no-result';q('#search').dispatchEvent(new w.Event('input'));assert.equal(q('.property'),null)});
test('Client: hero auto 2s, pause et reprise',t=>{const {q,tick,intervals}=setup(t);assert([...intervals.values()].every(x=>x.ms===2000));const before=q('.hero-images img.active').src;tick();assert.notEqual(q('.hero-images img.active').src,before);q('#pause').click();const paused=q('.hero-images img.active').src;tick();assert.equal(q('.hero-images img.active').src,paused);q('#pause').click();tick();assert.notEqual(q('.hero-images img.active').src,paused)});
test('Client: galerie compacte, lightbox, ID, choix et fermeture',t=>{const {q,tick,w}=setup(t,{product:true});const old=q('#compact-image').src;tick();assert.notEqual(q('#compact-image').src,old);q('.compact-cover').click();assert(q('#lightbox').open);assert.match(q('#viewer-id').textContent,/STN-006/);const first=q('#viewer-count').textContent;tick();assert.notEqual(q('#viewer-count').textContent,first);q('#gallery-pause').click();q('#viewer-thumbs button').click();assert.equal(q('#viewer-count').textContent,'01 / 04');w.document.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight'}));assert.equal(q('#viewer-count').textContent,'02 / 04');q('#lightbox .close').click();assert(!q('#lightbox').open);assert(!w.document.body.classList.contains('modal-open'))});
test('Client: pagination mobile/tablette/desktop et menu mobile',t=>{for(const [width,count]of [[320,1],[390,1],[768,2],[1280,3]]){const {q,w}=setup(t,{width});assert.equal(w.document.querySelectorAll('.property').length,count);q('.menu').click();assert.equal(q('.menu').getAttribute('aria-expanded'),'true');q('.menu').click();assert.equal(q('.menu').getAttribute('aria-expanded'),'false')}});
test('Client: blocage drag/contextmenu images sans bloquer les textes',t=>{const {q,w}=setup(t);for(const type of ['dragstart','contextmenu']){const e=new w.Event(type,{bubbles:true,cancelable:true});q('img').dispatchEvent(e);assert(e.defaultPrevented)}const e=new w.Event('contextmenu',{bubbles:true,cancelable:true});q('h1').dispatchEvent(e);assert(!e.defaultPrevented)});
function fill(q){q('[name=name]').value='Client Test';q('[name=phone]').value='0912345678';q('[name=needs]').value='Test STN-001';q('input[type=checkbox]').checked=true}
test('Client: échec conserve les données et retry réutilise ID; succès efface le formulaire',async t=>{const calls=[];let n=0;const {q}=setup(t,{live:true,fetcher:async(u,o)=>{calls.push(JSON.parse(o.body));return {ok:++n>1,json:async()=>n===1?{ok:false,error:'CRM indisponible'}:{ok:true,message:'Đã lưu yêu cầu.',requestId:calls.at(-1).requestId}}}});fill(q);await q('#lead-form').onsubmit({preventDefault(){},target:q('#lead-form')});assert.equal(q('[name=name]').value,'Client Test');assert.match(q('#form-status').textContent,/CRM indisponible/);await q('#lead-form').onsubmit({preventDefault(){},target:q('#lead-form')});assert.equal(calls[0].requestId,calls[1].requestId);assert.equal(q('[name=name]').value,'');assert.match(q('#form-status').textContent,/Đã lưu yêu cầu/)});
test('Client: demo ne transmet aucune donnée',async t=>{let n=0;const {q}=setup(t,{fetcher:async()=>n++});fill(q);await q('#lead-form').onsubmit({preventDefault(){},target:q('#lead-form')});assert.equal(n,0);assert(q('button[type=submit]').disabled)});
test('Hero: sáu ảnh khác nhau chạy đủ vòng rồi trở lại ảnh đầu',t=>{
 const {q,w,tick}=setup(t);
 const slides=[...w.document.querySelectorAll('.hero-images img')];
 assert.equal(slides.length,6);assert.equal(new Set(slides.map(x=>x.src)).size,6);
 assert.equal(q('#slide-total').textContent,'06');
 const first=q('.hero-images img.active').src;
 for(let i=1;i<=6;i++){tick();assert.equal(q('#slide-num').textContent,String(i%6+1).padStart(2,'0'));assert.equal(w.document.querySelectorAll('.hero-images img.active').length,1);}
 assert.equal(q('.hero-images img.active').src,first);
});
test('Hero: CRM đổi URL/ALT, preload theo ảnh đầu; không đổi ảnh tư vấn',()=>{
 const content={...data,settings:{...data.settings,hero_image_01:'https://example.com/banner.webp',hero_image_01_alt:'Ảnh <mới>',hero_text_12:'99',image_05:'/assets/interior.jpg'}};
 const dom=new JSDOM(renderPage({content,config:readConfig({DEMO_MODE:'true'})}));
 const q=s=>dom.window.document.querySelector(s);
 assert.equal(q('.hero-images img').getAttribute('src'),'https://example.com/banner.webp');
 assert.equal(q('.hero-images img').alt,'Ảnh <mới>');
 assert.equal(q('link[rel=preload][as=image]').getAttribute('href'),'https://example.com/banner.webp');
 assert.equal(q('#slide-total').textContent,'06');
 assert.equal(q('.service-photo img').getAttribute('src'),'/assets/interior.jpg');dom.window.close();
});
