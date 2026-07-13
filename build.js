/**
 * GoDart landing — build script (không cần cài thêm gì, chỉ cần Node).
 * Đọc nội dung từ content/site.json, ráp vào template.html → dist/index.html.
 * Netlify chạy tự động (xem netlify.toml). Chạy tay khi dev local: node build.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'site.json'), 'utf8'));
// Ô mới thêm sau này (site.json cũ có thể chưa có key) — mặc định để build không fail.
// Lưu ý: chỉ áp khi key KHÔNG TỒN TẠI; người dùng chủ động xoá trắng ô ('' ) vẫn được tôn trọng.
if (content.how) {
  if (content.how.chip_truoc == null) content.how.chip_truoc = 'Quẹt phải';
  if (content.how.chip_cam == null) content.how.chip_cam = 'không';
  if (content.how.chip_sau == null) content.how.chip_sau = 'tự động gửi CV — bạn luôn kiểm soát việc chia sẻ hồ sơ.';
}
let html = fs.readFileSync(path.join(ROOT, 'template.html'), 'utf8');

// Chữ từ CMS luôn được escape để không phá vỡ HTML
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------- Các khối lặp (danh sách) ---------- */

const jobs = content.jobs.map(function (j) {
  return Object.assign({ initial: String(j.company).trim().charAt(0).toUpperCase() }, j);
});
if (jobs.length < 3) { console.error('Cần ít nhất 3 việc trong mục "Thẻ việc demo" (deck dùng 3 thẻ chồng nhau).'); process.exit(1); }

// JSON nhúng vào <script> — escape "<" để an toàn
const jobsJson = JSON.stringify(jobs).replace(/</g, '\\u003c');
html = html.replace('{{JOBS_JSON}}', jobsJson);

const steps = content.how.steps.map(function (s, i) {
  return '        <div class="step"><div class="step-head"><span class="step-num">BƯỚC ' + (i + 1) + '</span><p>' + esc(s.title) + '</p></div><p class="step-body">' + esc(s.body) + '</p></div>';
}).join('\n');
html = html.replace('{{STEPS}}', steps);

const triangleIcon = '<svg width="19" height="19" viewBox="0 0 96 96" aria-hidden="true"><polygon points="20,22 76,48 20,74" fill="#FF8A4D"></polygon></svg>';
const circleIcon = '<svg width="19" height="19" viewBox="0 0 96 96" aria-hidden="true"><circle cx="48" cy="48" r="30" fill="none" stroke="#6FC0EF" stroke-width="15"></circle></svg>';
const safetyItems = content.safety.items.map(function (text, i) {
  const icon = i < Math.ceil(content.safety.items.length / 2) ? triangleIcon : circleIcon;
  return '          <div class="safety-row">' + icon + '<p>' + esc(text) + '</p></div>';
}).join('\n');
html = html.replace('{{SAFETY_ITEMS}}', safetyItems);

const quoteItems = content.quotes.items.map(function (text, i) {
  const cls = ['', ' quote--2', ' quote--3'][i % 3];
  const color = i % 2 ? '#2E8FCC' : '#F26B2C';
  return '        <div class="quote' + cls + '"><div class="quote-inner"><span class="quote-mark" style="color: ' + color + ';" aria-hidden="true">&#8220;</span><p>' + esc(text) + '</p></div></div>';
}).join('\n');
html = html.replace('{{QUOTE_ITEMS}}', quoteItems);

const faqItems = content.faq.map(function (f, i) {
  const open = i === 0;
  return '        <div class="faq-item">\n' +
    '          <button class="faq-q" type="button" aria-expanded="' + open + '" aria-controls="faq-a-' + i + '" id="faq-q-' + i + '"><span class="q">' + esc(f.q) + '</span><span class="faq-sign" aria-hidden="true">' + (open ? '–' : '+') + '</span></button>\n' +
    '          <div class="faq-a" id="faq-a-' + i + '" role="region" aria-labelledby="faq-q-' + i + '"' + (open ? '' : ' hidden') + '><p>' + esc(f.a) + '</p></div>\n' +
    '        </div>';
}).join('\n');
html = html.replace('{{FAQ_ITEMS}}', faqItems);

/* ---------- Các token đơn {{a.b.c}} ---------- */

const tokens = {};
(function flat(obj, prefix) {
  Object.keys(obj).forEach(function (k) {
    const v = obj[k];
    const key = prefix ? prefix + '.' + k : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) flat(v, key);
    else if (!Array.isArray(v)) tokens[key] = v;
  });
})(content, '');
// Bí danh job1..jobN cho thẻ demo tĩnh trong HTML
jobs.forEach(function (j, i) {
  Object.keys(j).forEach(function (k) { tokens['job' + (i + 1) + '.' + k] = j[k]; });
});

Object.keys(tokens).forEach(function (k) {
  html = html.split('{{' + k + '}}').join(esc(tokens[k]));
});

// Còn sót token nào là báo lỗi ngay để Netlify fail build thay vì deploy trang hỏng
const leftover = html.match(/{{[A-Za-z0-9_.]+}}/g);
if (leftover) { console.error('Thiếu nội dung cho token: ' + leftover.join(', ')); process.exit(1); }

/* ---------- Ghi ra dist/ ---------- */

const DIST = path.join(ROOT, 'dist');
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, 'index.html'), html);
fs.cpSync(path.join(ROOT, 'admin'), path.join(DIST, 'admin'), { recursive: true });
console.log('OK: dist/index.html (' + html.length + ' bytes) + dist/admin/');
