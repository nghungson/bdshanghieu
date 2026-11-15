# Đặc điểm bất động sản — cập nhật giao diện và CRM

## Cập nhật GitHub
Giải nén gói ZIP. Tại thư mục gốc repository bdshanghieu, chọn Add file → Upload files, kéo các thư mục src, public, tests, docs vào. Không kéo thư mục bao ngoài, không tải nguyên ZIP. Commit changes rồi chờ Vercel Ready và mở Visit.
Không xóa file cũ. Gói này bổ sung/ghi đè file đúng đường dẫn; không thay Settings, nội dung chữ, banner, cấu hình Vercel, khóa bí mật hoặc dữ liệu khách.

## Vị trí và hành vi
Mở một trang chi tiết sản phẩm Nhà phố, Hotel/Motel hoặc Biệt thự: khối Đặc điểm bất động sản nằm dưới gallery và phần hotline, trước nội dung mô tả/bản đồ. Icon và chữ màu gold sẫm trên nền champagne sáng. Mặc định mở, bấm tiêu đề hoặc dùng bàn phím để thu gọn. Hai cột trên màn hình rộng; một cột ở màn hình dưới 380px.
Đất Vàng không có khối này. Trang danh sách vẫn giữ bố cục gọn hiện tại.

## Nhập dữ liệu trong tab Properties
Ba trường có sẵn: price (Mức giá), area (Diện tích), frontage (Mặt tiền).
Thêm 5 tiêu đề cột dưới đây vào hàng 1, ở 5 cột trống liên tiếp phía cuối bảng, không chèn đè cột hiện có:
legal_status	road_width	floors	bathrooms	interior

Nếu bảng còn nguyên 24 cột ban đầu thì 5 cột mới là Y1:AC1. Nếu đã có cột ảnh bổ sung, dùng cột trống sau cùng. Chỉ có một cột cho mỗi tên, không tạo tên trùng. Không đổi tên các cột cũ.

| Cột | Nội dung | Ví dụ minh họa cách nhập |
| --- | --- | --- |
| legal_status | Thông tin pháp lý đã kiểm tra | Sổ đỏ/Sổ hồng |
| road_width | Chiều rộng đường vào, mét | 24 |
| floors | Số tầng hoặc mô tả cấu trúc tầng | 7 hoặc 7 tầng + 1 hầm |
| bathrooms | Số phòng tắm, WC | 6 |
| interior | Tình trạng nội thất | Cơ bản |

Không dùng số ví dụ làm thông tin thực cho sản phẩm. Để trống trường chưa xác minh: website sẽ ẩn trường đó. Nhập số 0 chỉ khi đúng là không có. Giá giữ đúng cách nhập hiện tại, ví dụ 8x tỷ đồng, không tự chuyển sang 88 tỷ.

Apps Script hiện tại đọc dữ liệu theo tên cột và truyền cả những cột bổ sung, nên KHÔNG cần thay Code.gs hoặc ContentDefaults.gs để sử dụng 5 cột này. Sau khi kết nối CRM và DEMO_MODE=false, website sẽ đọc chúng; đợi khoảng 60 giây rồi tải lại trang sau khi sửa Sheet.
Website đang demo vẫn dùng kho minh họa trong code. Các hồ sơ minh họa chưa có 5 thông số mới nên chỉ hiện giá, diện tích và mặt tiền trong khối này. Không cần tắt demo chỉ để thử giao diện; không tự điền pháp lý/số tầng cho hồ sơ minh họa.

## Kiểm tra sau triển khai
1. Mở sản phẩm Nhà phố, Khách sạn và Biệt thự: thấy khối mới, bấm thu gọn/mở lại.
2. Mở Đất vàng: không có khối mới.
3. Khi CRM đã nối: điền dữ liệu thật cho một sản phẩm, kiểm tra các trường xuất hiện; xóa một giá trị rồi kiểm tra trường đó ẩn.
4. Xem trên điện thoại và máy tính; kiểm tra đoạn pháp lý/nội thất dài vẫn xuống dòng.

Kiểm thử cục bộ: npm run build; kiểm tra đủ 8 trường qua chuẩn hóa dữ liệu, ba danh mục được hỗ trợ, ẩn toàn bộ khối ở Đất Vàng, dữ liệu cũ/ô trống, đơn vị đo, escape HTML. Chưa kiểm thử Sheet/email thật hoặc xác nhận trực quan trên thiết bị của chủ website.
