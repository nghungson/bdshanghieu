# Cập nhật 6 ảnh hero — BĐS Hàng Hiệu

## Upload lên GitHub
1. Giải nén BDSHangHieu-6-Hero-Update.zip.
2. Mở repository nghungson/bdshanghieu, ở thư mục gốc (nơi có package.json).
3. Chọn Add file → Upload files. Kéo các thư mục content, templates, src, public, tests, docs trong thư mục vừa giải nén vào vùng upload. Không kéo thư mục bao ngoài; không upload nguyên file ZIP.
4. Ghi commit: Cap nhat 6 anh hero banner. Chọn Commit changes.
5. Vercel sẽ triển khai lại theo GitHub. Chờ Ready rồi mở Visit, tải lại trang bằng Ctrl+F5.

Đây là gói cập nhật, KHÔNG phải toàn bộ mã nguồn. Không xóa các thư mục/file cũ; chỉ bổ sung/ghi đè file cùng đường dẫn. Nếu GitHub hỏi có ghi đè các file cùng tên, đây là các file cần cập nhật. Gói không chứa .env hay khóa kết nối.

## 6 slide
1. Biệt thự hiện đại sân vườn — Modern Villa with Tropical Pool Garden-1.png
2. Khách sạn — Grand Neoclassical Luxury Hotel-2.png
3. Biệt thự cổ mặt tiền — Historic Colonial Villa in a Lush Garden-3.png
4. Villa hồ bơi — Modern Villa with Turquoise Pool-4.png
5. Biệt thự cổ góc nghiêng — Sunlit Colonial Villa Behind Lush Gardens-3.png
6. Dinh thự — Grand Baroque Palace and Garden Gate-6.png

Giữ nguyên ảnh, chỉ chuyển định dạng WebP chất lượng 82, kích thước gốc 1672×941. Không phóng lớn, không sửa kiến trúc. Đây là ảnh banner minh họa được cung cấp, không thay ảnh hồ sơ BĐS.

## Quản lý ảnh trong CRM
Không cần đổi Google Apps Script để bản cập nhật hiển thị sáu ảnh: website có sẵn đường dẫn mặc định mới.
Để sửa chúng trong CRM về sau:
1. Mở docs/HERO-SETTINGS.tsv bằng Notepad. Ctrl+A, Ctrl+C.
2. Mở tab Settings của Google Sheet. Chọn ô cột A tại dòng trống đầu tiên SAU toàn bộ dữ liệu hiện có.
3. Dán: có 12 dòng, 2 cột key/value. File không có hàng tiêu đề, không dán đè từ A1. Nếu Sheet không tự chia cột, dùng Data → Split text to columns → Tab.
4. Chỉ làm một lần; nếu đã có hero_image_01…06, sửa giá trị ở các dòng đó, không tạo khóa trùng.
5. Các dòng hero_image_01…06 chứa đường dẫn ảnh, dòng có hậu tố _alt chứa mô tả ảnh.
6. Khi Sheet đã kết nối và DEMO_MODE=false, thay value rồi đợi khoảng 60 giây, tải lại website. Không cần redeploy để sửa value trong Sheet. Upload file ảnh mới lên GitHub vẫn cần chờ Vercel deploy.

Các khóa image_02, image_03, image_04 cũ không còn điều khiển hero. Đừng xóa hay sửa các khóa khác. hero_text_12 không còn điều khiển bộ đếm; số 06 được tự tính từ số slide thật.
image_05 vẫn là ảnh A DISTINCTIVE PERSPECTIVE. Ảnh này giữ nguyên vì chưa có ảnh thay thế riêng được chỉ định. Logo, ảnh thumbnail, gallery sản phẩm, nội dung chữ và dữ liệu khách giữ nguyên.
Nội dung Settings trên Sheet luôn ưu tiên hơn nội dung mặc định trong code khi CRM đã kết nối.

## Kiểm thử
- npm run build: 42/42 kiểm thử tự động thành công, gồm cú pháp/cấu hình và kiểm thử API, Apps Script mô phỏng, DOM.
- Xác nhận 6 ảnh khác nhau, chuyển đủ vòng 6→1, timer 2000 ms, nút dừng/chạy.
- Xác nhận URL và ALT lấy từ CRM, preload theo đúng ảnh đầu, bộ đếm không bị giá trị hero_text_12 cũ ghi đè.
- Không kiểm thử kết nối Google Sheet/email thật trên tài khoản của chủ website trong lần cập nhật này.
- Chromium trong môi trường kiểm thử bị chặn khởi chạy; chưa xác nhận trực quan bằng trình duyệt thực. Sau triển khai cần mở Visit trên máy tính và điện thoại: chờ ít nhất 12 giây để xem đủ vòng, kiểm tra chữ và ảnh không tràn màn hình.

Nếu website vẫn hiện 3 ảnh, kiểm tra commit trên GitHub có templates/index.html mới và Vercel đang chạy đúng commit. Nếu có 6 ảnh nhưng không phải ảnh mới, kiểm tra giá trị hero_image_01…06 trong Settings.
