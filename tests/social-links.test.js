import test from 'node:test';
import assert from 'node:assert/strict';
import {load} from 'cheerio';
import {socialLinksHTML} from '../src/social-links.js';
import {renderPage} from '../src/render.js';
import {readConfig} from '../src/config.js';
import {defaultSettings} from '../src/store.js';
import {readFileSync} from 'node:fs';
const settings={social_facebook_url:'https://www.facebook.com/test.page',social_youtube_url:'https://www.youtube.com/@test',social_tiktok_url:'https://www.tiktok.com/@test'};
test('Social links accept channel URLs, preserve query and escape attributes',()=>{
 const $=load(socialLinksHTML({...settings,social_facebook_url:'https://www.facebook.com/share/test/?a=1&b=2'}));
 assert.equal($('a').length,3);assert.equal($('a').first().attr('href'),'https://www.facebook.com/share/test/?a=1&b=2');
 $('a').each((_,el)=>{assert.equal($(el).attr('target'),'_blank');assert.equal($(el).attr('rel'),'noopener noreferrer');});
});
test('Missing, hostile or wrong-platform URLs remain non-clickable icons',()=>{
 for(const url of ['', 'javascript:alert(1)', 'http://facebook.com/x','https://facebook.com.evil.example/x','https://facebook.com@evil.example/x','https://youtube.com/x','https://facebook.com:444/x']){
  const $=load(socialLinksHTML({social_facebook_url:url}));assert.equal($('a').length,0,url);assert.equal($('img').length,3);
 }
});
test('Shared footer replaces only footer hotline on home, product and privacy',()=>{
 const demo=JSON.parse(readFileSync(new URL('../content/demo-properties.json',import.meta.url),'utf8'));
 const content={properties:demo,settings:{...defaultSettings,...settings,footer_text_02:'Hotline 24/7'}};
 const config=readConfig({DEMO_MODE:'true',SITE_URL:'https://www.bdshanghieu.net'});
 for(const extra of [{},{product:demo[0]},{utility:{path:'/chinh-sach-bao-mat',html:'<h1>Quyền riêng tư</h1>'}}]){
  const $=load(renderPage({content,config,...extra}));assert.equal($('.footer-social a').length,3);
  assert.equal($('.footer-top > a[href^="tel:"]').length,0);assert.equal($('.floating a[href^="tel:"]').length,1);
  assert.equal($('.footer-bottom a').attr('href'),'/chinh-sach-bao-mat');
 }
});
