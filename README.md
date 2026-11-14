# BĐS Hàng Hiệu — Champagne Silk Satin

Bản bàn giao 14/11/2026 (giờ Việt Nam). Website Node.js/Express, HTML dựng tại máy chủ, giao diện tiếng Việt, CRM qua một Google Spreadsheet. Domain chính dự kiến: **https://www.bdshanghieu.net**; **https://bdshanghieu.net** chuyển sang www.

## Bắt đầu tại đây

1. Giải nén ZIP, mở thư mục có `package.json`.
2. Chạy xem thử theo hướng dẫn bên dưới.
3. Đưa mã nguồn lên GitHub theo [01-GITHUB.md](docs/01-GITHUB.md).
4. Tạo Google Sheets CRM theo [02-GOOGLE-SHEETS.md](docs/02-GOOGLE-SHEETS.md).
5. Triển khai Vercel, gắn tên miền theo [03-VERCEL-DOMAIN.md](docs/03-VERCEL-DOMAIN.md).
6. Hoàn tất checklist thử thật trong [04-TEST-REPORT.md](docs/04-TEST-REPORT.md) trước khi bật SEO và nhận khách.

**Trạng thái:** code đã kiểm thử tự động 40/40 và kiểm tra UI Chromium. Chưa triển khai trên tài khoản Vercel/GitHub của chủ website; chưa kết nối Sheet/email/Turnstile thật hoặc DNS. Sáu hồ sơ STN-001…STN-006 và ảnh kiến trúc là minh họa, không phải kho hàng chào bán. Chế độ mặc định không nhận khách và không cho công cụ tìm kiếm index.

## Xem thử trên Windows

Cài Node.js 24 LTS từ https://nodejs.org và Git từ https://git-scm.com. Mở PowerShell ngay trong thư mục dự án:

```powershell
npm ci
Copy-Item .env.example .env
npm run build
npm run dev
```

Mở **http://localhost:3000**. Dừng bằng Ctrl+C. Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay cho `npm`; không cần tắt chính sách bảo vệ của Windows. macOS/Linux dùng `cp .env.example .env`.

`npm run build` kiểm tra cú pháp/cấu hình và chạy toàn bộ test; không tạo thư mục `dist` vì đây là ứng dụng Express. Không mở HTML bằng cách nhấp đúp. Không dùng GitHub Pages cho bản này: API và SEO phía máy chủ cần Node hosting.

## Nội dung đã có

- Header/footer đen, thân champagne kem vàng với ánh satin bằng CSS nhẹ; không tải texture nền.
- Bốn danh mục; tìm theo mã/tên/khu vực; mới nhất trước, không hiện ngày đăng; nút tiến/lùi.
- Trang riêng từng BĐS, thông số, giá dạng `8x tỷ`, gallery gọn và lightbox tự chuyển 2 giây; chọn ảnh, pause, phím mũi tên, mã BĐS trên ảnh.
- Hero tự chạy 2 giây, ticker một dòng, nút Zalo/điện thoại vuông.
- Lưu khách vào Sheet trước khi email; mã gửi chống trùng, kiểm tra dữ liệu, CAPTCHA phía máy chủ, email lỗi được đưa vào hàng chờ.
- Title/description/canonical/Open Graph/Twitter/JSON-LD/sitemap/robots dựng ở server; không chờ JavaScript để có nội dung SEO.
- Các ảnh, nội dung trang chủ, nội dung sản phẩm và SEO quản lý qua Sheet. Xem giới hạn và bảng trường ở tài liệu CRM.

Chặn chuột phải/kéo ảnh chỉ hạn chế thao tác thông thường; website không thể ngăn tuyệt đối tải ảnh hoặc chụp màn hình. Không có cam kết thứ hạng Google/Meta/TikTok.

## Cấu trúc chính

| Thư mục / tệp | Công dụng |
| --- | --- |
| `public/` | CSS, JS trình duyệt, ảnh công khai |
| `templates/`, `src/` | HTML và xử lý server/API/SEO |
| `content/` | Nội dung mặc định và dữ liệu minh họa |
| `google-apps-script/` | Backend Sheet và gửi email |
| `tests/` | Test API, Apps Script mô phỏng, tương tác DOM |
| `.env.example` | Mẫu cấu hình không có khóa thật |
| `vercel.json` | Cấu hình hosting |
| `.github/workflows/ci.yml` | Test khi push/pull request |
| `docs/` | Hướng dẫn triển khai, vận hành và báo cáo test |

Không đưa `.env`, khóa bí mật, dữ liệu khách hàng hoặc `node_modules` lên GitHub. ZIP không chứa các dữ liệu này.
