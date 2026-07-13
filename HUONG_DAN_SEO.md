# SEO GoDart — trạng thái & việc cần làm

## Đã có sẵn trong code (tự chạy mỗi lần build)

- **Title/description** tối ưu từ khoá — sửa được qua CMS `/admin` → mục "SEO".
- **JSON-LD** (dữ liệu có cấu trúc cho Google): Organization + WebSite + **FAQPage** (tự sinh từ các câu FAQ trong CMS — sửa FAQ là schema tự cập nhật).
- **Thẻ share mạng xã hội**: Open Graph + Twitter card + ảnh `og-image.png` 1200×630 chuẩn brand (hiện khi share link lên Facebook/Zalo/Messenger/TikTok bio).
- **robots.txt** (chặn index trang /admin) + **sitemap.xml** + canonical.
- Nền tảng tốt sẵn có: HTML ngữ nghĩa, 1 thẻ h1 duy nhất, `lang="vi"`, mobile-friendly, trang nhẹ ~70KB không ảnh nặng → Core Web Vitals gần như chắc chắn xanh.

## Việc cần làm 1 lần sau khi deploy (Long, ~20 phút)

1. **Google Search Console** — https://search.google.com/search-console:
   - Add property → chọn **Domain** → nhập `godart.vn`.
   - Google đưa 1 bản ghi **TXT** → vào Cloudflare → DNS → Records → Add record → Type TXT, Name `@`, dán giá trị → Save → quay lại GSC bấm Verify.
   - Sau khi verify: menu **Sitemaps** → nhập `sitemap.xml` → Submit.
   - Menu **URL Inspection** → nhập `https://godart.vn/` → **Request Indexing** (xin Google index sớm).
2. **Kiểm tra ảnh share**: dán `https://godart.vn` vào https://developers.facebook.com/tools/debug/ (bấm Scrape Again nếu chưa thấy ảnh). Zalo tự đọc og:image.
3. **Kiểm tra FAQ schema**: dán URL vào https://search.google.com/test/rich-results — phải thấy "FAQ" hợp lệ.

## Hiểu đúng kỳ vọng cho landing 1 trang

- Trang này sẽ thắng các tìm kiếm **thương hiệu** ("godart", "godart app", "app godart tìm việc") sau 1–2 tuần được index.
- Các từ khoá cạnh tranh cao ("tìm việc làm", "việc làm TP.HCM"…) do các sàn lớn thống trị — landing 1 trang không đấu được, và **không nên** nhồi từ khoá vào trang.
- Đòn bẩy SEO thật của GoDart nằm ở **giai đoạn 2**: blog tiếng Việt trên godart.vn (mẹo tìm việc, nhận diện tin tuyển dụng lừa đảo, mức lương theo ngành cho fresher…) — đúng chủ đề "chống lừa đảo" vừa là moat thương hiệu vừa là cụm từ khoá ít cạnh tranh. Khi làm blog, mô hình template+CMS hiện tại mở rộng được.
- Trước mắt, traffic chính vẫn nên đến từ TikTok/social theo GTM plan — SEO là kênh tích luỹ dài hạn.

## Lưu ý kỹ thuật

- `og-image.png` nằm ở `static/` — thay ảnh khác thì giữ đúng kích thước 1200×630 và tên file.
- `static/` được copy nguyên vào web khi build — file SEO tĩnh mới (vd file verify) cứ bỏ vào đây.
- Đổi title/description qua CMS là đủ, đừng sửa trong template.
