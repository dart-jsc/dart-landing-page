/**
 * GoDart Waitlist — Google Apps Script
 * Nhận đăng ký từ landing page và ghi vào Google Sheet.
 *
 * CÀI ĐẶT (làm 1 lần, ~10 phút — chi tiết xem HUONG_DAN_TRIEN_KHAI.md):
 * 1. Tạo Google Sheet mới (vd tên "GoDart Waitlist").
 * 2. Menu "Tiện ích mở rộng" (Extensions) → "Apps Script".
 * 3. Xoá code mẫu, dán TOÀN BỘ file này vào, bấm Lưu (Ctrl+S).
 * 4. Bấm "Triển khai" (Deploy) → "Bản triển khai mới" (New deployment)
 *    → biểu tượng bánh răng → chọn loại "Ứng dụng web" (Web app):
 *      - Thực thi bằng (Execute as): Tôi (Me)
 *      - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 5. Bấm Triển khai → cấp quyền khi Google hỏi (Advanced → Go to … (unsafe)
 *    là bình thường vì script tự viết chưa qua kiểm duyệt của Google).
 * 6. Copy "URL ứng dụng web" (kết thúc bằng /exec)
 *    → dán vào hằng WAITLIST_ENDPOINT trong template.html.
 *
 * LƯU Ý: mỗi lần sửa file này phải Deploy → Quản lý bản triển khai
 * (Manage deployments) → ✏️ → Phiên bản: Mới (New version) thì thay đổi
 * mới có hiệu lực. URL giữ nguyên, không cần dán lại.
 *
 * (Đã setup xong ngày 11/07/2026 — file này giữ lại để tham khảo/tái tạo khi cần.)
 */

var SHEET_NAME = 'Waitlist';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // tránh 2 người gửi cùng lúc ghi đè nhau
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(['Thời gian', 'Loại', 'Email / SĐT', 'Đồng ý liên hệ', 'Nhận tin sản phẩm', 'Nguồn']);
      sh.setFrozenRows(1);
    }
    var p = (e && e.parameter) || {};
    sh.appendRow([
      new Date(),
      p.type === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên',
      String(p.contact || '').slice(0, 200),
      p.consent === 'yes' ? 'Có' : 'Không',
      p.marketing === 'yes' ? 'Có' : 'Không',
      String(p.source || '').slice(0, 300)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Mở URL /exec trực tiếp trên trình duyệt mà thấy dòng chữ này = script đang chạy.
function doGet() {
  return ContentService.createTextOutput('GoDart waitlist endpoint đang hoạt động.');
}
