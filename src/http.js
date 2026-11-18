import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createContentStore,createGateway} from './store.js';
import {readConfig,leadsReady,leadConfigurationIssues} from './config.js';
import {escapeHTML as esc,propertyPath} from './data.js';
import {renderPage,errorHTML} from './render.js';
import {validateLead,verifyTurnstile} from './leads.js';
const publicDir=fileURLToPath(new URL('../public/',import.meta.url));
export function createApp(express,{config=readConfig(),gateway=createGateway(config),fetcher=fetch}={}){
 const app=express(),store=createContentStore(config,gateway);app.disable('x-powered-by');
 app.use((req,res,next)=>{
  res.set({'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()','X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':"default-src 'self'; base-uri 'none'; object-src 'none'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://challenges.cloudflare.com; frame-src 'self' https://maps.google.com https://www.google.com https://challenges.cloudflare.com; frame-ancestors 'self'; form-action 'self'"});
  if(!config.indexable)res.set('X-Robots-Tag','noindex, nofollow');
  const host=(req.headers.host||'').split(':')[0];
  if(config.canonicalRedirect&&config.canonicalAliases.has(host)&&host!==new URL(config.origin).hostname&&['GET','HEAD'].includes(req.method))return res.redirect(308,config.origin+req.originalUrl);
  next();
 });
 app.use(express.json({limit:'16kb',strict:true}));
 app.get('/api/health',(_,res)=>res.set('Cache-Control','no-store').json({ok:true,mode:config.demo?'demo':'live',leadsEnabled:leadsReady(config),configurationIssues:leadConfigurationIssues(config)}));
 app.get('/api/catalog',async(_,res)=>{try{const d=await store.get();res.set('Cache-Control','no-store').json(d);}catch{res.status(503).json({ok:false,error:'Kho hàng tạm thời chưa tải được.'});}});
 app.post('/api/leads',async(req,res)=>{
  res.set('Cache-Control','no-store');
  if(!config.allowedOrigins.has(req.get('origin')))return res.status(403).json({ok:false,error:'Nguồn gửi không hợp lệ.'});
  if(!leadsReady(config))return res.status(503).json({ok:false,error:'Biểu mẫu chưa được kích hoạt. Vui lòng gọi 0916372468.'});
  let lead;try{lead=validateLead(req.body)}catch{return res.status(400).json({ok:false,error:'Vui lòng kiểm tra tên, số điện thoại, nhu cầu và sự đồng ý liên hệ.'});}
  try{
   if(!await verifyTurnstile(req.body.turnstileToken,config,fetcher))return res.status(400).json({ok:false,error:'Xác minh chưa hợp lệ hoặc đã hết hạn. Vui lòng thử lại.'});
   const result=await gateway.lead(lead);
   if(result.saved!==true)throw Error('NOT_SAVED');
   res.status(200).json({ok:true,saved:true,requestId:lead.requestId,emailStatus:result.emailStatus==='sent'?'sent':'queued',message:'Đã lưu yêu cầu. Chúng tôi sẽ liên hệ theo thông tin anh/chị cung cấp.'});
  }catch(e){res.status(e.message==='RATE_LIMIT'?429:502).json({ok:false,error:e.message==='RATE_LIMIT'?'Anh/chị vừa gửi yêu cầu. Vui lòng chờ một phút trước khi gửi tiếp.':'Chưa xác nhận được việc lưu yêu cầu. Có thể gửi lại cùng yêu cầu hoặc gọi Hotline để kiểm tra.'});}
 });
 app.get('/robots.txt',(_,res)=>res.type('text/plain').send(config.indexable?'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+config.origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n'));
 app.get('/sitemap.xml',async(_,res)=>{try{const data=await store.get();const urls=config.indexable?['/','/chinh-sach-bao-mat',...data.properties.map(propertyPath)]:[];res.type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(u=>'<url><loc>'+esc(config.origin+u)+'</loc></url>').join('')+'</urlset>');}catch{res.status(503).type('text/plain').send('Sitemap temporarily unavailable');}});
 app.get('/product.html',async(req,res)=>{try{const d=await store.get(),p=d.properties.find(p=>p.id===req.query.id);if(!p)return res.status(404).send(errorHTML('Không tìm thấy bất động sản'));res.redirect(301,propertyPath(p));}catch{res.status(503).send(errorHTML('Kho hàng đang được cập nhật'));}});
 app.get('/index.html',(_,res)=>res.redirect(301,'/'));
 app.get('/bat-dong-san/:id/:slug',async(req,res)=>{try{const content=await store.get(),product=content.properties.find(p=>p.id===req.params.id);if(!product)return res.status(404).set('X-Robots-Tag','noindex').send(errorHTML('Không tìm thấy bất động sản'));if(req.path!==propertyPath(product))return res.redirect(301,propertyPath(product));res.set('Cache-Control','no-store').send(renderPage({content,config,product}));}catch{res.status(503).send(errorHTML('Kho hàng tạm thời chưa tải được'));}});
 app.get('/',async(_,res)=>{try{const content=await store.get();res.set('Cache-Control','no-store').send(renderPage({content,config}));}catch{res.status(503).send(errorHTML('Kho hàng tạm thời chưa tải được'));}});
 app.get('/chinh-sach-bao-mat',async(_,res)=>{try{const content=await store.get();const text=content.settings.privacy_text||'Thông tin về chính sách xử lý dữ liệu đang được chủ website hoàn thiện. Vui lòng gọi 0916372468 để được giải đáp trước khi cung cấp thông tin cá nhân.';res.set('Cache-Control','no-store').send(renderPage({content,config,utility:{title:'Quyền riêng tư | BĐS Hàng Hiệu',path:'/chinh-sach-bao-mat',html:'<section class="privacy-page"><h1>Quyền riêng tư</h1><p class="property-description">'+esc(text)+'</p><p><a href="tel:0916372468">Liên hệ: 0916372468</a></p></section>'}}));}catch{res.status(503).send(errorHTML('Nội dung tạm thời chưa tải được'));}});
 // Local development only; Vercel serves public/ on its CDN.
 app.use(express.static(publicDir,{index:false,dotfiles:'deny',maxAge:'1h'}));
 app.use((req,res)=>res.status(404).set('X-Robots-Tag','noindex').send(errorHTML('Trang không tồn tại')));
 app.use((err,req,res,next)=>{if(res.headersSent)return next(err);if(req.path.startsWith('/api/'))return res.status(err.status===413?413:400).json({ok:false,error:'Dữ liệu gửi không hợp lệ hoặc quá lớn.'});res.status(500).send(errorHTML('Không thể tải trang lúc này'));});
 return app;
}
