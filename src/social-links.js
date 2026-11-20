import {escapeHTML as esc} from './data.js';

const channels = [
  ['facebook', 'Facebook', ['facebook.com', 'fb.com', 'fb.me']],
  ['youtube', 'YouTube', ['youtube.com', 'youtu.be']],
  ['tiktok', 'TikTok', ['tiktok.com']]
];

function channelURL(value, domains) {
  try {
    const url = new URL(String(value || '').trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return '';
    return domains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain)) ? url.href : '';
  } catch { return ''; }
}

export function socialLinksHTML(settings) {
  return '<div class="footer-social" role="group" aria-label="Mạng xã hội BĐS Hàng Hiệu">' + channels.map(([key, label, domains]) => {
    const href = channelURL(settings['social_' + key + '_url'], domains);
    const img = `<img src="/assets/social/${key}.png" alt="" width="56" height="56" loading="lazy" decoding="async" draggable="false">`;
    return href
      ? `<a class="footer-social-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer" aria-label="${label} — mở trong tab mới" title="${label}">${img}</a>`
      : `<span class="footer-social-link is-unconfigured" role="img" aria-label="${label} — chưa có liên kết" title="${label} — đang cập nhật liên kết">${img}</span>`;
  }).join('') + '</div>';
}
