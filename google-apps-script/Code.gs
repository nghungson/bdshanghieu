/** BĐS Hàng Hiệu — Google Sheets CRM. Keep the spreadsheet private.
 * Run setup(), set API_SECRET in Script Properties, deploy Web App as owner.
 * Copy ContentDefaults.gs into a second Apps Script file before setup(). */
const ADMIN_EMAIL='nghungson@gmail.com';
const PROPERTY_HEADERS=['id','title','category','street','ward','city','area','frontage','price','image','image_1','image_2','image_3','image_4','description','seo_title','seo_description','seo_keywords','og_title','og_description','og_image','tiktok_caption','published','created_at','legal_status','road_width','floors','bathrooms','interior'];
const LEAD_HEADERS=['request_id','created_at','name','phone','email','intent','budget','needs','consent','email_status','fingerprint','email_attempts','email_last_error'];
function setup(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();PropertiesService.getScriptProperties().setProperty('SHEET_ID',ss.getId());
 [['Properties',PROPERTY_HEADERS],['Settings',['key','value']],['Leads',LEAD_HEADERS]].forEach(([n,h])=>{const sheet=ss.getSheetByName(n)||ss.insertSheet(n);if(!sheet.getLastRow())sheet.appendRow(h);else{const existing=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];h.forEach(k=>{if(!existing.includes(k)){existing.push(k);sheet.getRange(1,existing.length).setValue(k)}})}sheet.setFrozenRows(1);sheet.getRange(1,1,1,sheet.getLastColumn()).setBackground('#000000').setFontColor('#e8bd4e').setFontWeight('bold');});
 const settings=ss.getSheetByName('Settings'),keys=settings.getDataRange().getValues().slice(1).map(r=>r[0]);Object.keys(CONTENT_DEFAULTS).forEach(key=>{if(!keys.includes(key))settings.appendRow([key,CONTENT_DEFAULTS[key]])});
 const triggers=ScriptApp.getProjectTriggers();if(!triggers.some(t=>t.getHandlerFunction()==='stampProperty'))ScriptApp.newTrigger('stampProperty').forSpreadsheet(ss).onEdit().create();
 if(!triggers.some(t=>t.getHandlerFunction()==='retryPendingEmails'))ScriptApp.newTrigger('retryPendingEmails').timeBased().everyMinutes(5).create();
 ss.getSheetByName('Properties').getRange('A:A').setNumberFormat('@');
}
function db(){return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));}
function json(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
function table(sheet){const all=sheet.getDataRange().getValues(),headers=all.shift();return {headers,rows:all.map((r,i)=>({index:i+2,data:Object.fromEntries(headers.map((k,j)=>[k,r[j] instanceof Date?r[j].toISOString():String(r[j]??'')]))}))};}
function readContent(){
 const ss=db();const properties=table(ss.getSheetByName('Properties')).rows.map(r=>r.data).filter(p=>String(p.published).toLowerCase()==='true').map(p=>({...p,images:Object.keys(p).filter(k=>/^image_\d+$/.test(k)).sort((a,b)=>Number(a.split('_')[1])-Number(b.split('_')[1])).map(k=>p[k]).filter(Boolean)}));
 return {ok:true,properties,settings:Object.fromEntries(table(ss.getSheetByName('Settings')).rows.map(r=>[r.data.key,r.data.value]))};
}
function doGet(){return json({ok:false,code:'POST_REQUIRED'});}
function doPost(e){
 try{
  const p=JSON.parse(e.postData.contents||'{}'),expected=PropertiesService.getScriptProperties().getProperty('API_SECRET');
  if(!expected||expected.length<32||typeof p.secret!=='string'||p.secret!==expected)return json({ok:false,code:'UNAUTHORIZED'});
  if(p.action==='content')return json(readContent());
  if(p.action==='lead')return json(saveLead(p.lead));
  return json({ok:false,code:'UNKNOWN_ACTION'});
 }catch(err){return json({ok:false,code:'REQUEST_FAILED'});}
}
function text(v,n){if(typeof v!=='string'||v.length>n)throw Error('INVALID_INPUT');return v.trim();}
function safeCell(v){return /^[=+\-@\t\r\n]/.test(String(v))?"'"+v:v;}
function validateLead(p){
 if(!p||p.consent!==true)throw Error('INVALID_INPUT');
 const out={request_id:text(p.requestId,80),name:text(p.name,100),phone:text(p.phone,30),email:text(p.email||'',200),intent:text(p.intent,100),budget:text(p.budget,100),needs:text(p.needs,3000),fingerprint:text(p.fingerprint,64)};
 if(!/^[0-9a-f-]{36}$/i.test(out.request_id)||out.name.length<2||out.needs.length<3||!/^0[0-9]{9}$/.test(out.phone)||! /^[0-9a-f]{64}$/.test(out.fingerprint))throw Error('INVALID_INPUT');
 return out;
}
function updateCell(sheet,headers,row,key,value){const col=headers.indexOf(key)+1;if(!col)throw Error('RUN_SETUP');sheet.getRange(row,col).setValue(value);}
function saveLead(payload){
 const lead=validateLead(payload),lock=LockService.getScriptLock();lock.waitLock(10000);
 try{
  const sheet=db().getSheetByName('Leads'),t=table(sheet);const duplicate=t.rows.find(r=>r.data.request_id===lead.request_id);
  if(duplicate){if(duplicate.data.fingerprint!==lead.fingerprint)return {ok:false,code:'ID_CONFLICT'};return {ok:true,saved:true,emailStatus:duplicate.data.email_status==='sent'?'sent':'queued',duplicate:true};}
  if(t.rows.some(r=>r.data.phone.replace(/^'/,'')===lead.phone&&Date.now()-new Date(r.data.created_at).getTime()<60000))return {ok:false,code:'RATE_LIMIT'};
  const record={...lead,created_at:new Date().toISOString(),consent:'Đồng ý liên hệ tư vấn',email_status:'pending',email_attempts:'0',email_last_error:''};
  sheet.appendRow(t.headers.map(k=>safeCell(record[k]||'')));SpreadsheetApp.flush();
  const row=sheet.getLastRow();const emailStatus=sendEmailForRow(sheet,t.headers,row,record);
  return {ok:true,saved:true,emailStatus};
 }finally{lock.releaseLock();}
}
function sendEmailForRow(sheet,headers,row,record){
 try{
  if(MailApp.getRemainingDailyQuota()<1){updateCell(sheet,headers,row,'email_status','queued');return 'queued';}
  const attempts=(Number(record.email_attempts)||0)+1;updateCell(sheet,headers,row,'email_attempts',attempts);
  MailApp.sendEmail({to:ADMIN_EMAIL,subject:'[BĐS Hàng Hiệu] '+record.name+' — '+record.request_id.slice(0,8),body:'Thời gian (UTC): '+record.created_at+'\nMã: '+record.request_id+'\nHọ tên: '+record.name+'\nĐiện thoại: '+record.phone+'\nEmail: '+record.email+'\nNhu cầu: '+record.intent+'\nNgân sách: '+record.budget+'\nNội dung: '+record.needs});
  updateCell(sheet,headers,row,'email_status','sent');updateCell(sheet,headers,row,'email_last_error','');return 'sent';
 }catch(err){updateCell(sheet,headers,row,'email_status','queued');updateCell(sheet,headers,row,'email_last_error',safeCell(String(err.message||'Mail error').slice(0,200)));return 'queued';}
}
function retryPendingEmails(){
 const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;
 try{const sheet=db().getSheetByName('Leads'),t=table(sheet);const pending=t.rows.filter(r=>['pending','queued'].includes(r.data.email_status)&&Number(r.data.email_attempts||0)<5).slice(0,10);for(const r of pending){if(MailApp.getRemainingDailyQuota()<1)break;sendEmailForRow(sheet,t.headers,r.index,r.data);}}finally{lock.releaseLock();}
}
function stampProperty(e){const sheet=e.range.getSheet();if(sheet.getName()!=='Properties')return;const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0],id=headers.indexOf('id')+1,date=headers.indexOf('created_at')+1;if(!id||!date)return;for(let row=Math.max(2,e.range.getRow());row<=e.range.getLastRow();row++){if(sheet.getRange(row,id).getValue()&&!sheet.getRange(row,date).getValue())sheet.getRange(row,date).setValue(new Date().toISOString());}}
