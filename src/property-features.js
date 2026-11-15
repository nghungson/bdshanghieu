import {escapeHTML as esc} from './data.js';
const icons={
 price:'<circle cx="12" cy="12" r="9"/><path d="M15 7v10M8 9h9M14 11c-6-3-7 7-1 5"/>',
 area:'<path d="M3 3h18v18H3zM3 10h7V3m0 7v5h11M10 21v-3"/>',
 legal:'<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6m-6 4h6"/>',
 frontage:'<path d="M3 5v14m18-14v14M4 12h16M8 8l-4 4 4 4m8-8 4 4-4 4"/>',
 road:'<path d="M8 3 3 21h18L16 3M12 4v3m0 4v3m0 4v2"/>',
 floors:'<path d="M5 21V3h14v18zM9 7h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1m-4 6v-3h2v3"/>',
 bathrooms:'<path d="M3 13h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 13V6a3 3 0 0 1 6 0M6 20v2m12-2v2M10 7h4"/>',
 interior:'<path d="m8 3-3 9h14l-3-9zM12 12v9m-5 0h10"/>'
};
function unit(value,suffix){const s=String(value??'').trim();return /^\d+(?:[.,]\d+)?$/.test(s)?s+' '+suffix:s;}
export function propertyFeaturesHTML(p){
 if(!['Thổ Cư/Nhà Phố','Hotel/Motel','Biệt Thự/Liền Kề'].includes(p.category))return '';
 const fields=[['price','Mức giá',p.price],['area','Diện tích',unit(p.area,'m²')],['legal','Pháp lý',p.legal_status],['frontage','Mặt tiền',unit(p.frontage,'m')],['road','Đường vào',unit(p.road_width,'m')],['floors','Số tầng',p.floors],['bathrooms','Số phòng tắm, WC',unit(p.bathrooms,'phòng')],['interior','Nội thất',p.interior]];
 const rows=fields.filter(([, ,v])=>String(v??'').trim());if(!rows.length)return '';
 return `<details class="property-features" open><summary>Đặc điểm bất động sản<span class="features-chevron" aria-hidden="true"></span></summary><dl class="features-grid">${rows.map(([icon,label,value])=>`<div class="feature-item"><svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[icon]}</svg><div><dt>${label}</dt><dd>${esc(value)}</dd></div></div>`).join('')}</dl></details>`;
}
