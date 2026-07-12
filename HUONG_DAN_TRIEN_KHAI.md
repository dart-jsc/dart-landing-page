# Hướng dẫn triển khai landing page GoDart

> Dành cho Long — không cần biết code. Gồm 2 việc, làm theo thứ tự:
> **A.** Nối form waitlist vào Google Sheet (~10 phút) → **B.** Đưa trang lên domain (~15 phút + chờ DNS).
> Tất cả đều miễn phí (Google Apps Script + gói free của Netlify là đủ cho giai đoạn waitlist).
> Sửa NỘI DUNG trang (không cần code): xem thêm `HUONG_DAN_CMS.md`.

---

## A. Thu thông tin waitlist vào Google Sheet ✅ (đã làm xong 11/07/2026)

Cách hoạt động: form trên trang gửi dữ liệu tới một "Web app" nhỏ chạy bằng Google Apps Script,
script này ghi thêm dòng vào Google Sheet **của bạn**. Không qua dịch vụ trung gian nào,
dữ liệu nằm nguyên trong Drive của bạn.

### Các bước

1. Tạo Google Sheet mới, đặt tên ví dụ **"GoDart Waitlist"** (dùng tài khoản Google của team).
2. Trên Sheet, mở menu **Tiện ích mở rộng (Extensions) → Apps Script**. Một tab trình soạn code mở ra.
3. Xoá đoạn code mẫu (`function myFunction() {...}`), mở file **`google-apps-script.gs`** (cùng thư mục với hướng dẫn này), copy **toàn bộ** nội dung và dán vào. Bấm **Lưu** (Ctrl+S).
4. Bấm nút **Triển khai (Deploy) → Bản triển khai mới (New deployment)**.
5. Bấm biểu tượng ⚙️ cạnh "Chọn loại" → chọn **Ứng dụng web (Web app)**, cấu hình:
   - **Thực thi bằng (Execute as):** Tôi (Me)
   - **Ai có quyền truy cập (Who has access):** **Bất kỳ ai (Anyone)** ← quan trọng, chọn sai là form không gửi được
6. Bấm **Triển khai** → Google hỏi cấp quyền: chọn tài khoản → nếu hiện cảnh báo "Google chưa xác minh ứng dụng này" thì bấm **Nâng cao (Advanced) → Đi tới … (không an toàn)** → **Cho phép**. (Bình thường — vì đây là script mình tự viết, chưa gửi Google kiểm duyệt.)
7. Copy **URL ứng dụng web** — dạng `https://script.google.com/macros/s/AKfycb…/exec`.
8. Dán URL vào hằng `WAITLIST_ENDPOINT` trong `template.html` (có khung chú thích to, dễ thấy).
9. Kiểm tra: mở trang → điền email thử → gửi → mở Sheet, tab **"Waitlist"** phải có dòng mới với đủ 6 cột (Thời gian / Loại / Email-SĐT / Đồng ý liên hệ / Nhận tin sản phẩm / Nguồn).

### Lưu ý

- **Sửa script sau này:** phải vào **Triển khai → Quản lý bản triển khai (Manage deployments) → ✏️ → Phiên bản: Mới (New version)** thì code mới mới chạy. URL giữ nguyên.
- **Múi giờ cột "Thời gian":** nếu giờ lệch, chỉnh trong Sheet: File → Cài đặt → Múi giờ → (GMT+7) Hồ Chí Minh.
- **Dữ liệu cá nhân (Luật BVDLCN 2025 / NĐ 13):** Sheet này chứa email/SĐT người dùng — chỉ share cho founders, không share link công khai. Form đã có checkbox đồng ý và cột ghi lại consent; khi có người yêu cầu xoá thông tin thì xoá dòng tương ứng.
- **Trùng lặp:** có thể có người đăng ký 2 lần — lọc trùng bằng Data → Data cleanup → Remove duplicates trước khi đếm số liệu.

---

## B. Deploy trang lên domain godart.vn

Khuyên dùng **Netlify** vì: miễn phí cho mục đích thương mại, tự cấp HTTPS/SSL, gắn domain riêng dễ.

### B1. Đưa trang lên mạng ✅ (đã có site trên Netlify)

1. Tạo tài khoản tại **https://app.netlify.com** (Sign up bằng email hoặc tài khoản Google).
2. Vào **https://app.netlify.com/drop** → kéo thả thư mục trang vào (chỉ dùng cho lần đầu — sau khi nối GitHub theo `HUONG_DAN_CMS.md` thì mọi cập nhật đi qua git/CMS).
3. Vài giây sau trang chạy tại địa chỉ dạng `https://ten-ngau-nhien.netlify.app` — mở thử, test form.

### B2. Đưa DNS của godart.vn về Cloudflare (làm 1 lần, nền móng lâu dài)

> Vì sao đặt DNS ở Cloudflare thay vì Netlify: sau này thêm `app.godart.vn`, `api.godart.vn`,
> đổi nhà hosting… chỉ là sửa từng bản ghi, DNS không "dính" vào nhà hosting nào,
> kèm Email Routing miễn phí (mục B4) và lớp chống DDoS khi cần.

1. Tạo tài khoản miễn phí tại **https://dash.cloudflare.com/sign-up**.
2. Bấm **Add a domain** → nhập `godart.vn` → chọn gói **Free** → Continue.
3. Cloudflare tự quét các bản ghi DNS hiện có (domain mới quét ra 0 bản ghi là bình thường) → cứ Continue.
4. Cloudflare đưa cho bạn **2 nameserver** (dạng `xxx.ns.cloudflare.com`). Vào trang quản lý domain nơi bạn mua godart.vn (Mắt Bão / PA Việt Nam / Tenten / iNET…), tìm mục **Nameservers / Máy chủ tên miền** → thay bằng đúng 2 nameserver đó.
5. Chờ Cloudflare kích hoạt — có email báo "godart.vn is now active" (thường vài phút tới vài giờ; tối đa 24–48h).

### B3. Trỏ godart.vn vào site Netlify

1. Trong Netlify: **Site configuration → Domain management → Add a domain** → nhập `godart.vn` → thêm cả `www.godart.vn` khi được hỏi.
2. Trong Cloudflare → chọn godart.vn → **DNS → Records** → tạo 2 bản ghi:

   | Loại | Tên (Name) | Trỏ tới (Target) | Proxy status |
   |---|---|---|---|
   | CNAME | `@` (godart.vn) | `ten-site-cua-ban.netlify.app` | **DNS only** (mây XÁM) |
   | CNAME | `www` | `ten-site-cua-ban.netlify.app` | **DNS only** (mây XÁM) |

   - `ten-site-cua-ban.netlify.app` = địa chỉ site Netlify cấp ở bước B1.
   - ⚠️ **Quan trọng:** bấm vào đám mây CAM để chuyển thành XÁM ("DNS only") — nếu để mây cam (Proxied), Netlify sẽ không cấp được SSL. Sau này khi cần lớp chống DDoS của Cloudflare thì đổi cấu hình SSL rồi mới bật lại.
   - Cloudflare cho phép CNAME ở tên `@` (tự "flatten") — cứ tạo bình thường.
3. Quay lại Netlify → Domain management → chờ hiện **HTTPS ✅** (Netlify tự cấp SSL Let's Encrypt) → bật **Force HTTPS**. Kiểm tra tiến độ DNS tại https://dnschecker.org nếu chờ lâu.

### B4. Bật email hello@godart.vn (miễn phí, nhận thư chuyển về Gmail)

Footer của trang đang in `hello@godart.vn` — bật mục này để địa chỉ đó nhận thư thật:

1. Trong Cloudflare → chọn godart.vn → menu **Email → Email Routing** → **Get started / Enable**.
2. **Create address:** phần địa chỉ nhập `hello`, phần **Destination** nhập Gmail bạn đang dùng → Cloudflare gửi email xác nhận tới Gmail đó → mở và bấm xác nhận.
3. Cloudflare hỏi thêm bản ghi MX/TXT → bấm **Add records automatically**.
4. Test: dùng một email khác gửi thư tới `hello@godart.vn` → thư phải về hộp Gmail của bạn.
5. Lưu ý: đây là chiều **nhận**. Muốn **gửi đi** từ hello@godart.vn (trả lời ứng viên bằng địa chỉ đẹp) thì sau này nâng cấp: Google Workspace (~140k/tháng) hoặc cấu hình "Send mail as" trong Gmail — chưa cần cho giai đoạn waitlist.

### B5. Cập nhật trang sau này

Trang đã chuyển sang mô hình CMS (xem `HUONG_DAN_CMS.md`):
- **Sửa nội dung (chữ):** vào godart.vn/admin, sửa qua form, bấm Publish — web tự cập nhật sau ~1 phút.
- **Sửa thiết kế/code:** Tân sửa `template.html` rồi `git push` — Netlify tự build.
- ⚠️ Sau khi đã nối repo GitHub theo HUONG_DAN_CMS.md thì **không kéo-thả thư mục lên Netlify nữa** (sẽ đè mất bản CMS đang quản lý).

### Phương án khác (tham khảo)

- **Cloudflare Pages**: tương tự Netlify; vì DNS đã đặt ở Cloudflare nên sau này muốn chuyển host sang đây chỉ là sửa 1 bản ghi DNS.
- **Vercel**: chỉ cân nhắc khi xây web app Next.js sau này (gói free của Vercel cấm dùng thương mại — startup phải trả Pro $20/tháng).

---

## C. Checklist trước khi chia sẻ link rộng rãi

- [ ] Đăng ký thử bằng **email** → có dòng mới trong Sheet
- [ ] Đăng ký thử bằng **SĐT** (10 số, bắt đầu bằng 0) → có dòng mới trong Sheet
- [ ] Thử trên **điện thoại** (quẹt thẻ demo, gửi form)
- [ ] `https://godart.vn` và `https://www.godart.vn` đều vào được, có ổ khoá (đã bật Force HTTPS)
- [ ] Gửi thử email tới `hello@godart.vn` → nhận được trong Gmail
- [ ] Sheet chỉ share cho founders + đã xoá các dòng test
- [ ] Test lại thông điệp lỗi: gửi form không tick đồng ý → hiện nhắc nhở

## D. Sự cố thường gặp

| Hiện tượng | Nguyên nhân & cách xử lý |
|---|---|
| Bước 6 cấp quyền hiện "Rất tiếc, không thể mở tệp tại thời điểm này" (URL có `authuser=…`) | Chrome đăng nhập nhiều tài khoản Google, popup cấp quyền mở nhầm tài khoản. Mở cửa sổ Ẩn danh (Ctrl+Shift+N), đăng nhập đúng 1 tài khoản chứa Sheet, mở lại Sheet → Apps Script → Triển khai lại từ bước 4. Bền hơn: tạo profile Chrome riêng cho tài khoản GoDart. |
| Gửi form báo thành công nhưng Sheet không có dòng mới | Bước 5: "Ai có quyền truy cập" chưa để **Anyone**; hoặc dán nhầm URL (phải kết thúc bằng `/exec`); hoặc sửa script mà chưa deploy **New version**. Mở URL `/exec` trên trình duyệt — phải thấy chữ "GoDart waitlist endpoint đang hoạt động." |
| Form hiện "Gửi chưa thành công — có thể do mạng" | Mạng người dùng chập chờn, hoặc URL endpoint sai/chưa deploy. Kiểm tra như trên rồi thử lại. |
| Domain chưa vào được sau khi trỏ DNS | DNS chưa lan truyền — chờ thêm, kiểm tra ở dnschecker.org. Nếu quá 48h, xem lại nameserver/bản ghi có gõ đúng không. |
| Netlify kẹt ở "Waiting on DNS / SSL" mãi | Bản ghi trong Cloudflare đang bật Proxied (mây CAM). Vào DNS → Records → bấm đám mây chuyển về **DNS only** (mây xám), chờ vài phút rồi Netlify → Domain management → Verify lại. |
| Gửi email tới hello@godart.vn không nhận được | Email Routing chưa Enable, destination Gmail chưa bấm xác nhận, hoặc chưa "Add records automatically" (thiếu MX). Vào Cloudflare → Email → Email Routing kiểm tra trạng thái từng mục. |
| Giờ trong Sheet bị lệch | Chỉnh múi giờ Sheet về GMT+7 (xem mục A — Lưu ý). |
