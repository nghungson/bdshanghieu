# Đặc điểm bất động sản — bản 2

Giải nén ZIP. Tại thư mục gốc repository bdshanghieu, chọn Add file → Upload files, kéo src, public, tests, docs vào, Commit changes. Không tải nguyên ZIP, không xóa các thư mục cũ. Chờ Vercel Ready rồi Ctrl+F5.

Trang chi tiết Nhà phố, Hotel/Motel và Biệt thự luôn hiển thị 9 mục với icon gold và tên mục: Mức giá, Diện tích, Pháp lý, Mặt tiền, Đường vào, Số tầng, Số phòng ngủ, Số phòng tắm/WC, Nội thất.

Nếu chưa nhập dữ liệu, icon và tên mục vẫn hiện, vùng thông số để trống: không hiện số 0, gạch ngang hay chữ thay thế. Nếu thật sự nhập số 0, website hiển thị số 0. Đất Vàng tiếp tục ẩn toàn bộ khối.

## Cột trong tab Properties
| Cột | Ý nghĩa | Cách nhập ví dụ |
| --- | --- | --- |
| price | Mức giá | 8x tỷ đồng |
| area | Diện tích m² | 212 |
| legal_status | Pháp lý | Sổ đỏ/Sổ hồng |
| frontage | Mặt tiền m | 20 |
| road_width | Đường vào m | 24 |
| floors | Số tầng | 7 |
| bedrooms | Số phòng ngủ (mới) | 5 |
| bathrooms | Số phòng tắm, WC | 6 |
| interior | Nội thất | Cơ bản |

Thêm tiêu đề bedrooms vào hàng 1 của một cột trống cuối bảng Properties. Nếu chưa thêm năm cột bản trước, thêm legal_status, road_width, floors, bathrooms, interior vào các cột trống cuối bảng. Không tạo tên cột trùng hoặc ghi đè tiêu đề hiện có. Nhập dữ liệu cùng hàng với sản phẩm tương ứng. Không cần thay Apps Script vì nó đọc theo tên cột.

Website hiện demo sẽ hiện đủ 9 icon nhưng chỉ 3 giá trị của hồ sơ minh họa. Dữ liệu nhập trong Sheet sẽ hiển thị sau khi kết nối CRM, tắt demo; thay Sheet có thể cần khoảng 60 giây rồi tải lại. Không điền số ví dụ như thông tin thật nếu chưa xác minh.

Bản này giữ nguyên nội dung chữ đã cập nhật, sáu hero và dòng hotline căn giữa. Kiểm thử: 47/47 tự động, bao gồm 3 danh mục nhà, loại trừ đất, 9 mục, dữ liệu trống/số 0, phòng ngủ qua chuẩn hóa dữ liệu, chống chèn HTML. Chưa kiểm tra trực quan trên trình duyệt thực hoặc kết nối Sheet/email thật.
