# 01 — Đưa mã nguồn lên GitHub

GitHub lưu code; Vercel chạy website. Chủ website giữ quyền sở hữu cả hai tài khoản.

## Cách dùng GitHub Desktop (dễ thao tác)

1. Cài GitHub Desktop từ https://desktop.github.com và đăng nhập tài khoản của anh.
2. Tại GitHub, tạo repository **Private**, tên `bdshanghieu`. Không chọn tạo README, .gitignore hoặc license vì gói đã có cấu hình.
3. Trong GitHub Desktop, Clone repository này vào một thư mục mới.
4. Chép **nội dung bên trong** thư mục dự án đã giải nén vào thư mục clone; `package.json` phải ở gốc, không lồng thêm một thư mục `bdshanghieu-production`.
5. Bật hiển thị tệp ẩn để kiểm tra có `.gitignore`, `.env.example`, `.github/`. Không chép `.env` hoặc `node_modules`.
6. Xem danh sách Changes, ghi summary `Launch champagne website`, Commit to main, rồi Push origin.
7. Mở repo trên GitHub, kiểm tra tab Actions. Workflow Website checks phải màu xanh.

## Cách dùng PowerShell/Git

Chạy trong thư mục có `package.json` sau khi đã chạy `npm run build` thành công. Tạo repo Private rỗng như trên. Thay `TEN_TAI_KHOAN` bằng username thật:

```powershell
git init -b main
git add .
git status --short
git commit -m "Launch BDS Hang Hieu champagne website"
git remote add origin https://github.com/TEN_TAI_KHOAN/bdshanghieu.git
git push -u origin main
```

Ở bước `git status`, bảo đảm không có `.env`, `node_modules` hoặc dữ liệu Leads. Git có thể yêu cầu thiết lập tên/email tác giả ở lần đầu; dùng thông tin GitHub của anh. Đăng nhập qua cửa sổ Git Credential Manager/GitHub, không đặt token trong lệnh remote hoặc code. Nếu repo đã có dữ liệu, clone và cập nhật thay vì `push --force`.

## Các lần sửa sau

Nội dung Sheet tự cập nhật theo cache, không cần push. Thay giao diện/code hoặc thêm ảnh vào `public/assets` cần commit/push và chờ Vercel triển khai lại. Nên dùng nhánh thử, xem Preview và merge sau khi Actions xanh. Build Vercel cũng chạy test, nên test lỗi sẽ chặn bản build mới.

Nguồn: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
