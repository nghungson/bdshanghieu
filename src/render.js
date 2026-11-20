import {readFileSync} from 'node:fs';
import {load} from 'cheerio';
import {escapeHTML as esc,imageURL,propertyPath,safeJSON} from './data.js';
import {productHTML} from './product-view.js';
import {leadsReady} from './config.js';
import {socialLinksHTML} from './social-links.js';
const home=readFileSync(new URL('../templates/index.html',import.meta.url),'utf8');
const detail=readFileSync(new URL('../templates/product.html',import.meta.url),'utf8');
export function cardHTML(p){return `<a class="property" href="${esc(propertyPath(p))}" aria-label="Xem ${esc(p.title)}"><div class="card-photo"><img src="${esc(imageURL(p.image))}" alt="${esc(p.title)}" loading="lazy" draggable="false"><span class="badge">${p.demo?'HỒ SƠ MINH HỌA':'TUYỂN CHỌN'}</span><span class="card-open">→</span></div><div class="card-body"><div class="card-meta"><span>${esc(p.category)}</span><span>${esc(p.id)}</span></div><h3>${esc(p.title)}</h3><p class="address">${esc(p.street)} · ${esc(p.city)}</p><div class="card-bottom"><span>${esc(p.area)} m² · MT ${esc(p.frontage)} m</span><strong>${esc(p.price)}</strong></div></div></a>`;}
function absoluteImage(value,origin){return new URL(imageURL(value),origin).href;}
export function renderPage({content,config,product,utility,status=200}){
 const $=load(product||utility?detail:home);const s=content.settings;
 $('[data-cms]').each((_,el)=>{const key=$(el).attr('data-cms');if(Object.hasOwn(s,key))$(el).text(s[key]);});
 $('[data-cms-image]').each((_,el)=>{const key=$(el).attr('data-cms-image');if(s[key])$(el).attr('src',imageURL(s[key]));if(s[key+'_alt'])$(el).attr('alt',s[key+'_alt']);});
 if(!product&&!utility){
  const slides=$('.hero-images img');
  $('#slide-total').text(String(slides.length).padStart(2,'0'));
  $('link[rel="preload"][as="image"]').attr('href',slides.first().attr('src'));
 }
 $('script[src="/config.js"]').remove();$('script[src="/app.js"]').attr('src','/app.js');
 $('.footer-bottom a[href="/admin.html"]').attr('href','/chinh-sach-bao-mat').text('Quyền riêng tư');
 $('.footer-top > a[href^="tel:"]').replaceWith(socialLinksHTML(s));
 $('header a[aria-label="BĐS Hàng Hiệu trang chủ"]').attr('href','/');
 $('a[data-cat]').each((_,el)=>$(el).attr('href','/?category='+encodeURIComponent($(el).attr('data-cat'))+'#collection'));
 if(product){$('#product-main').html(productHTML(product,content.properties,s));}
 else if(utility){$('#product-main').html(utility.html);}
 else{
  $('#properties').html(content.properties.slice(0,3).map(cardHTML).join('')||'<p>Danh sách đang được cập nhật. Vui lòng gọi Hotline để nhận lựa chọn phù hợp.</p>');
  $('#collection-count').text(`1–${Math.min(3,content.properties.length)} / ${content.properties.length} bất động sản`);
  if(!content.properties.length)$('#collection-count').text('0 bất động sản');
  $('#properties').after('<noscript><p>Các hồ sơ bất động sản:</p><ul>'+content.properties.map(p=>`<li><a href="${esc(propertyPath(p))}">${esc(p.title)}</a></li>`).join('')+'</ul></noscript>');
  $('#lead-form [name=website]').attr('aria-hidden','true');
  $('#lead-form').append('<p class="privacy-link"><a href="/chinh-sach-bao-mat">Thông tin về quyền riêng tư và liên hệ xử lý dữ liệu →</a></p>');
  const ready=leadsReady(config);
  if(ready){$('#form-status').text('Thông tin chỉ dùng để tiếp nhận nhu cầu và liên hệ tư vấn.');if(config.requireTurnstile){$('#lead-form button[type=submit]').before('<div id="turnstile-widget"></div>');$('head').append('<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit" defer></script>');}}
  else{$('#form-status').text(config.demo?'Bản xem thử: biểu mẫu chưa nhận dữ liệu. Vui lòng gọi hoặc nhắn Zalo.':'Biểu mẫu chưa được kích hoạt. Vui lòng gọi 0916372468 hoặc nhắn Zalo.');$('#lead-form button[type=submit]').attr('disabled','disabled');}
 }
 if(!config.demo)$('#demo-note').remove();
 const route=product?propertyPath(product):(utility?.path||'/');
 const canonical=config.origin+route;
 const title=product?(product.seo_title||product.title+' | BĐS Hàng Hiệu'):(utility?.title||s.seo_title||'BĐS Hàng Hiệu — Sơn thẩm nhà');
 const description=product?(product.seo_description||`${product.title}. ${product.area} m², mặt tiền ${product.frontage} m, ${product.price}. ${product.street}, ${product.city}. Hotline 0916372468.`):(utility?.description||s.seo_description||'BĐS Hàng Hiệu — Sơn thẩm nhà. Hotline 0916372468.');
 $('title').text(title);
 function meta(selector,attrs){let tag=$(selector);if(!tag.length){$('head').append('<meta>');tag=$('head meta').last()}tag.attr(attrs);}
 meta('meta[name="description"]',{name:'description',content:description});
 meta('meta[name="keywords"]',{name:'keywords',content:product?.seo_keywords||s.seo_keywords||''});
 meta('meta[name="theme-color"]',{name:'theme-color',content:'#000000'});
 meta('meta[name="robots"]',{name:'robots',content:config.indexable&&status===200?'index,follow':'noindex,nofollow'});
 const ogTitle=product?(product.og_title||title):(s.og_title||title);const ogDescription=product?(product.og_description||description):(s.og_description||description);
 const image=absoluteImage(product?(product.og_image||product.image):(s.og_image||'/assets/hero.jpg'),config.origin);
 for(const [key,value]of Object.entries({'og:title':ogTitle,'og:description':ogDescription,'og:image':image,'og:url':canonical,'og:type':product?'article':'website','og:locale':'vi_VN','og:site_name':'BĐS Hàng Hiệu'}))meta(`meta[property="${key}"]`,{property:key,content:value});
 meta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
 meta('meta[name="twitter:title"]',{name:'twitter:title',content:ogTitle});meta('meta[name="twitter:description"]',{name:'twitter:description',content:ogDescription});meta('meta[name="twitter:image"]',{name:'twitter:image',content:image});
 $('link[rel="canonical"]').remove();$('head').append(`<link rel="canonical" href="${esc(canonical)}">`);
 const schema={'@context':'https://schema.org','@type':product?'RealEstateListing':'WebSite',name:title,url:canonical,description,inLanguage:'vi-VN',...(product?{about:{'@type':'Place',name:product.title,address:{'@type':'PostalAddress',streetAddress:product.street,addressLocality:product.city,addressCountry:'VN'}},image:product.images.map(i=>absoluteImage(i,config.origin))}:{publisher:{'@type':'Organization',name:'BĐS Hàng Hiệu',url:config.origin,telephone:'+84916372468'}})};
 $('head').append('<script type="application/ld+json">'+safeJSON(schema)+'</script>');
 if(product)$('head').append('<script type="application/ld+json">'+safeJSON({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Trang chủ',item:config.origin+'/'},{'@type':'ListItem',position:2,name:product.title,item:canonical}]})+'</script>');
 const bootstrap={properties:content.properties.map(({seo_title,seo_description,seo_keywords,og_title,og_description,og_image,tiktok_caption,...p})=>p),productId:product?.id||null,leadsEnabled:leadsReady(config),turnstileSiteKey:leadsReady(config)&&config.requireTurnstile?config.turnstileSiteKey:'',demo:config.demo};
 $('script[src="/app.js"]').before('<script id="site-data" type="application/json">'+safeJSON(bootstrap)+'</script>');
 if(product||utility)$('link[rel="preload"][as="image"]').remove();
 if(product)$('head').append(`<link rel="preload" as="image" href="${esc(imageURL(product.images[0]))}">`);
 // Keep all server strings as text, not Sheet-provided HTML.
 return '<!doctype html>'+$.html().replace(/^<!DOCTYPE html>/i,'');
}
export function errorHTML(message){return '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BĐS Hàng Hiệu</title><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/redesign.css"><main class="wrap" style="padding-top:80px"><h1 style="font-size:40px">'+esc(message)+'</h1><p>Vui lòng thử lại sau hoặc liên hệ Hotline.</p><a class="button gold" href="tel:0916372468">Hotline: 0916372468</a><p><a href="/">Về trang chủ</a></p></main></html>';}
