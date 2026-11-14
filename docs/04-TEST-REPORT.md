# 04 — Báo cáo kiểm thử và checklist nghiệm thu

Bản Champagne Silk Satin, 14/11/2026 (giờ Việt Nam).

## Đã chạy trong môi trường phát triển

**40/40 test tự động PASS**, 0 fail, 0 skipped. Lệnh: `npm run build` → kiểm tra source/config → `node --test tests/*.test.js`. Test có thể chạy lại trên máy anh và GitHub Actions; không cần secret thật.

| Nhóm | Phạm vi đã kiểm tra |
| --- | --- |
| Server/API — 22 test | SSR home và 6 trang sản phẩm; SEO riêng, canonical/OG/schema/sitemap/robots; URL cũ, slug sai, 404; demo/noindex; kiểm tra đầu vào/origin/body quá lớn; Turnstile token/action/hostname mô phỏng; lưu thành công, email queued, lỗi CRM, rate limit; escape XSS; không lộ endpoint/secret/source/Leads; cache; thứ tự và dữ liệu không hợp lệ; apex→www; fingerprint; nội dung và ALT qua CMS |
| Apps Script — 11 test | Chạy code gs thật trong VM với dịch vụ Google mô phỏng: setup không phá dữ liệu, timestamp, email đúng admin, chống trùng, ID conflict, lỗi email và retry, hết quota, rate limit, chống công thức nguy hiểm, auth, không trả Leads, ngày đăng tự điền một lần |
| Client — 7 test | DOM mô phỏng chạy public/app.js: 4 bộ lọc/tìm kiếm/paging, hero auto 2s và pause, gallery/ID/thumbnails/phím/đóng, kích thước danh sách mobile/tablet/desktop và menu, hạn chế drag/contextmenu, retry form giữ ID và input, demo không gửi |

`npm audit --json`: 0 lỗ hổng được báo cáo tại thời điểm kiểm tra, bao gồm dev dependencies. Điều này không thay thế đánh giá bảo mật độc lập. Cấu hình vercel.json đã kiểm tra các giá trị bằng JSON schema chính thức; chưa thực hiện deploy/build trên hạ tầng Vercel thật.

## Kiểm tra trực tiếp bằng Chromium

- Giao diện nền champagne satin, header/footer đen, viền sẫm và nút Hotline chữ lớn.
- Home paging 1–3 → 4–6; lọc Hotel/Motel; mở trang riêng STN-003.
- Gallery tự đổi ảnh, chọn thumbnail, nút ảnh tiếp, pause/đóng; mã STN-003 xuất hiện trong viewer.
- Trang quyền riêng tư và các URL điều hướng nội bộ hoạt động.
- Khung iframe responsive rộng danh nghĩa 320/390/768 px: chiều rộng nội dung tương ứng 305/375/753 do scrollbar, không tràn ngang. Thử menu tại 320 và lightbox tại 390; lightbox nằm trong khung.
- Đã sửa trường hợp ảnh demo trùng nhau và tăng khoảng trống dưới footer để tránh nút floating che link.

Kiểm tra responsive dùng Chromium trong iframe, không phải máy iPhone/iPad/foldable thật. Chưa xác nhận trên Safari/iOS, thiết bị gập vật lý hoặc mạng di động chậm. Không công bố điểm Lighthouse/Core Web Vitals vì chưa đo trên hosting thật. Maps nhúng đã xuất hiện nhưng độ chính xác vị trí thực tế cần kiểm tra bằng dữ liệu BĐS thật.

## Chưa kiểm thử được nếu chưa có tài khoản/cấu hình thật

- Apps Script quyền truy cập, quota Google, ghi Spreadsheet thật và thư đến inbox admin.
- Widget Turnstile và Siteverify bằng khóa thật trên domain chính.
- Vercel production/CDN, cold start, giới hạn tải đồng thời, DNS/TLS.
- Crawl/index Google, hiển thị OG thật trên từng mạng xã hội.

Không có email thật hoặc dữ liệu khách thật được gửi trong đợt kiểm thử này. Bộ test không chứng minh các dịch vụ ngoài đã kết nối.

## Checklist bắt buộc trước công bố

1. [ ] Thay tất cả hồ sơ minh họa bằng hàng thật, bốn ảnh thật mỗi bài; kiểm tra quyền dùng ảnh. Thử bốn danh mục.
2. [ ] Đổi một tiêu đề/ảnh/giá trong Sheet, chờ tối đa khoảng 60 giây và tải lại: home, detail, View Source/OG đều khớp.
3. [ ] Thử published=FALSE và thiếu ảnh: bài phải ẩn. Khôi phục đủ dữ liệu, bài phải hiện đúng thứ tự ngày.
4. [ ] Mở một sản phẩm trên điện thoại, iPad, laptop, thiết bị gập nếu có; đọc nội dung, xem gallery2s, chọn ảnh, đóng bằng X/Escape.
5. [ ] Gửi form thử có đồng ý liên hệ qua domain chính: thấy mã tiếp nhận, Sheet có đúng một dòng, đủ nhu cầu và thời gian. Nhận email tại nghungson@gmail.com, kiểm tra cả Spam.
6. [ ] Thử dữ liệu sai/thiếu checkbox không gửi; thử hai lần trong một phút và kiểm tra chống trùng/rate limit.
7. [ ] Trên Sheet thử riêng, kiểm tra email queued/retry và khả năng khôi phục. Không cố ý gây lỗi tài khoản thật khi đang nhận khách.
8. [ ] Mở tel và Zalo trên điện thoại của anh, kiểm tra đúng người nhận; không cần gọi thực tế nếu chỉ kiểm tra link.
9. [ ] Domain gốc→www, HTTP→HTTPS, đường dẫn sản phẩm giữ nguyên, không có cảnh báo chứng chỉ.
10. [ ] privacy_text hoàn chỉnh; xác nhận chỉ quản trị được xem Leads; Sheet không Publish to web.
11. [ ] Bật INDEXABLE=true ở Production sau nghiệm thu; robots mở, sitemap có URL thật, canonical https://www.bdshanghieu.net.
12. [ ] Giữ INDEXABLE=false cho Preview, sao lưu Sheet và kiểm tra theo dõi email queued định kỳ.
