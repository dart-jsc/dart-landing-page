# Hướng dẫn CMS — sửa nội dung không cần code

> Kết quả sau khi setup: các bạn non-code mở **godart.vn/admin**, đăng nhập bằng email,
> sửa chữ qua form, bấm **Publish** → ~1 phút sau web tự cập nhật. Thiết kế không thể bị phá
> vì layout nằm trong template, người sửa chỉ chạm được vào phần chữ.

## Trang này vận hành thế nào (đọc 1 phút)

```
content/site.json  ←  toàn bộ CHỮ trên trang (người non-code sửa qua /admin)
template.html      ←  KHUNG THIẾT KẾ (chỉ Tân/dev đụng vào)
build.js           →  ráp 2 thứ trên thành dist/index.html (Netlify tự chạy)
admin/             →  trang quản trị Decap CMS tại godart.vn/admin
```

Khi ai đó bấm Publish trên /admin: CMS ghi thay đổi vào `content/site.json` trên GitHub
→ Netlify thấy repo thay đổi → tự chạy `node build.js` → đưa bản mới lên godart.vn.

⚠️ **Quan trọng:** sau khi chuyển sang mô hình này, KHÔNG kéo-thả thư mục lên Netlify nữa
(sẽ đè mất bản do CMS build). Mọi thay đổi đi qua git hoặc /admin.

---

## Setup một lần (~30 phút, cần Tân hỗ trợ phần GitHub)

### 1. Đưa code lên GitHub

1. Tạo repo **private** trên GitHub, ví dụ `dart-jsc/godart-landing`.
2. Thư mục `05_Ky_Thuat/landing-page` đã được `git init` sẵn kèm commit đầu tiên — chỉ cần:
   ```
   cd F:\GODART\05_Ky_Thuat\landing-page
   git remote add origin https://github.com/dart-jsc/godart-landing.git
   git push -u origin main
   ```

### 2. Chuyển Netlify từ kéo-thả sang build từ GitHub

1. Netlify → site hiện tại → **Site configuration → Build & deploy → Link repository**.
2. Chọn GitHub → chọn repo `godart-landing` → branch `main`.
3. Build command và publish directory Netlify tự đọc từ `netlify.toml` (`node build.js` / `dist`) — không phải điền gì.
4. Deploy đầu tiên chạy xong → mở godart.vn kiểm tra trang vẫn y nguyên.

### 3. Bật đăng nhập email với DecapBridge (miễn phí)

1. Đăng ký tại **https://decapbridge.com** (Free forever: 3 site, 10 người sửa).
2. Tạo **Site** mới → nối với repo GitHub `godart-landing` theo hướng dẫn của họ.
3. DecapBridge sinh sẵn một khối cấu hình `backend:` → copy **đè lên khối backend placeholder**
   trong file `admin/config.yml` (khối có ghi chú ⚠️ ở đầu file) → commit & push (hoặc nhờ Tân).
4. Trong DecapBridge, bấm **Invite** và nhập email từng người cần quyền sửa nội dung.
   Họ nhận email mời → đặt mật khẩu → xong.

### 4. Kiểm tra

- Mở **godart.vn/admin** → đăng nhập bằng email vừa mời.
- Sửa thử một chữ (vd dòng badge ở Hero) → **Publish**.
- Chờ ~1 phút → F5 godart.vn → thấy chữ mới. Vào Sheet kiểm tra form vẫn chạy.

---

## Dành cho người sửa nội dung (gửi các bạn non-code)

1. Vào **godart.vn/admin**, đăng nhập bằng email được mời.
2. Bấm **"Trang chủ (godart.vn)" → "Toàn bộ nội dung trang"**.
3. Nội dung chia theo từng mục đúng thứ tự trên trang: Hero → Thẻ việc demo → Biết đủ để
   quyết định → Ba bước → An toàn → Trích khảo sát → Waitlist → FAQ → Footer.
4. Sửa xong bấm **Publish** (nút trên cùng). Chờ ~1 phút là web cập nhật — không cần làm gì thêm.
5. Quy ước:
   - Không cần lo vỡ giao diện — bạn chỉ sửa được chữ, không đụng được vào thiết kế.
   - Thẻ việc demo: giữ 3–6 thẻ; thẻ số 1 là thẻ hiện trên cùng của deck.
   - Mục "Trích khảo sát": khi có trích dẫn thật đã xin phép, thay nội dung và xoá chữ
     PLACEHOLDER trong nhãn góc phải.
   - Viết đúng brand voice: xưng "mình", gọi "bạn", câu ngắn, không hứa "đảm bảo có việc".

## Dành cho dev (Tân)

- Sửa thiết kế/layout: sửa `template.html` (token `{{...}}` là chỗ nội dung được ráp vào).
- Thêm field mới cho CMS: thêm vào `content/site.json` + khai field trong `admin/config.yml`
  + đặt token trong `template.html`. `build.js` tự flatten JSON thành token `{{a.b.c}}`.
- Các danh sách (jobs, steps, safety items, quotes, faq) được `build.js` render bằng vòng lặp —
  markup mẫu nằm ngay trong `build.js`.
- Build fail (Netlify báo đỏ) khi có token thiếu nội dung — lỗi in rõ tên token.
- Dev local: `node build.js` rồi mở `dist/index.html` (hoặc chạy server tĩnh trỏ vào `dist/`).

## Sự cố thường gặp

| Hiện tượng | Xử lý |
|---|---|
| /admin hiện "Error loading the CMS configuration" | File `admin/config.yml` sai cú pháp YAML (thụt dòng). Xem lại thay đổi gần nhất. |
| Đăng nhập /admin báo sai — dù đúng mật khẩu | Khối `backend:` trong config.yml chưa thay bằng khối DecapBridge sinh ra, hoặc người đó chưa được Invite trong DecapBridge. |
| Publish rồi mà web không đổi | Xem tab Deploys trên Netlify: nếu build đỏ, đọc log — thường là token thiếu nội dung (xoá trắng một ô bắt buộc). Sửa lại ô đó và Publish lại. |
| Web hiện bản cũ sau khi Publish | Chờ đủ 1–2 phút cho build xong; kiểm tra Deploys có bản mới "Published". |
