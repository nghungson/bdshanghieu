# 06 — Vận hành và bảo trì

## Quản lý nội dung

Cập nhật thường ngày tại Properties/Settings. Các khóa khởi tạo còn thiếu có thể được bổ sung bằng chạy lại setup; không ghi đè giá trị đã sửa. Dữ liệu nội dung cache 60 giây trên mỗi instance; trang đang mở không tự refresh nội dung Sheet. Mỗi ảnh tệp mới nên có tên mới để CDN không giữ ảnh cũ.

Không đặt thông tin riêng tư của khách vào Properties/Settings vì hai tab này cung cấp dữ liệu công khai cho website. Lead nằm riêng ở Leads. Việc xóa dữ liệu theo yêu cầu của khách cần xử lý cả Sheet và các email/bản sao liên quan mà chủ website quản lý.

Theo dõi Leads mỗi ngày, đặc biệt pending/queued. Sao lưu Sheet định kỳ bằng công cụ Google; giới hạn người được sửa và bật xác thực hai bước cho tài khoản quản trị. Tốc độ/khả năng nhận khách phụ thuộc Google Apps Script và quota; khi lượng lead lớn nên chuyển sang database/queue và dịch vụ email chuyên dụng.

## Hiệu năng và chuyển động

CSS champagne satin không thêm ảnh nền hoặc video. Ảnh sản phẩm có lazy loading, bản đồ tải lười, ảnh chính preload; ảnh đã tải hiển thị lại trong gallery. Hero/galleries chạy2s; có nút pause và ngừng tự chuyển khi tab bị ẩn. CSS tôn trọng reduced-motion cho chuyển cảnh/ticker, nhưng timer gallery vẫn có thể đổi ảnh; người xem có thể pause.

Font Google Fonts tải bên ngoài và có font dự phòng. Nếu yêu cầu hoàn toàn không phụ thuộc CDN font, có thể tự host font cùng giấy phép ở public/assets và đổi @import. Logo do chủ website cung cấp; ảnh kiến trúc hiện là minh họa từ phiên bản thiết kế trước. Chưa xác minh ảnh này mô tả tài sản thật hoặc quyền phân phối lại cho mục đích chào bán: thay bằng ảnh đã được anh cho phép trước khi bật kho thật.

Chặn right-click/drag không phải bảo vệ bản quyền tuyệt đối. Mã BĐS phủ trong lightbox giúp nhận diện, nhưng không chống screenshot; muốn bảo vệ tốt hơn cần watermark vào tệp ảnh gốc trước upload.

## Thay code và rollback

`npm ci` → `npm run build` → commit/push. Vercel chạy lại build/test. Chọn Preview để xem thay đổi trước khi đưa lên production; GitHub Actions chỉ kiểm tra, không thay thế thiết lập quyền merge/branch protection. Hạn chế quyền repo của bên thứ ba. Có thể dùng rollback Vercel khi phiên bản mới lỗi; dữ liệu Sheet vẫn là dữ liệu hiện tại.

Không xoay secret trong public code. Nếu lộ API_SECRET: tạo mới, sửa Script Properties và Vercel tương ứng, redeploy, kiểm tra form. Không ghi secret vào issue/screenshot/log. Nếu thay email quản trị, cập nhật ADMIN_EMAIL trong Apps Script, tạo deployment version mới và gửi thử.

## Phạm vi SEO

HTML SSR, title/description, OG, canonical, JSON-LD và sitemap hỗ trợ đọc nội dung và chia sẻ. Keywords chỉ là trường biên tập; không có bảo đảm thứ hạng. TikTok caption lưu trong Sheet để sử dụng khi đăng nội dung; không có tự đăng bài, Pixel, Ads hoặc tài khoản Meta/TikTok tích hợp. Việc thêm tracking phải được cấu hình và cân nhắc chính sách xử lý dữ liệu riêng.
