# 02 — Một Google Spreadsheet quản lý nội dung và khách hàng

Không cần công khai Spreadsheet hoặc dùng Publish to web. Một file có ba tab: **Properties**, **Settings**, **Leads**. Chỉ chia sẻ quyền chỉnh sửa cho người quản trị tin cậy. Website chỉ nhận dữ liệu công khai của Properties/Settings qua server; Leads không có API đọc công khai.

## Cài Apps Script

1. Tạo một Google Spreadsheet mới bằng tài khoản quản trị.
2. Chọn Extensions → Apps Script. Dán toàn bộ `google-apps-script/Code.gs` vào Code.gs.
3. Tạo file script tên `ContentDefaults`, dán nội dung `ContentDefaults.gs` cùng thư mục. Không dán dấu Markdown vào trình soạn thảo.
4. Lưu, chọn hàm `setup`, bấm Run. Đọc và cấp quyền cho chính project của mình. Hàm tạo ba tab, ghi SHEET_ID, tạo trigger ngày đăng và thử gửi lại email mỗi 5 phút. Chạy lại setup không xóa dữ liệu hiện có.
5. Trên máy anh tạo secret ngẫu nhiên bằng PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

6. Apps Script → Project Settings → Script Properties → thêm `API_SECRET` bằng chuỗi vừa tạo. Giữ kín chuỗi này. `SHEET_ID` đã do setup tạo. Không điền secret vào ô Sheet, GitHub hoặc public JS.
7. Deploy → New deployment → Web app. Execute as: **Me**. Who has access: **Anyone**, để server website gọi được mà không cần người mua đăng nhập Google. Endpoint tự kiểm tra secret cho mỗi POST. Anh chỉ cấp quyền thực thi Web App; không chia sẻ công khai Spreadsheet.
8. Copy URL kết thúc `/exec`. Điền URL và cùng secret vào biến Vercel `GOOGLE_APPS_SCRIPT_URL`, `GOOGLE_APPS_SCRIPT_SECRET` theo tài liệu 03.
9. Khi thay code Apps Script: Deploy → Manage deployments → Edit → New version → Deploy; giữ URL hiện tại. Chỉ Save code chưa cập nhật phiên bản Web App.

Nếu tài khoản Workspace không cho Web App truy cập Anyone, cần quản trị Google Workspace cho phép hoặc dùng backend khác; không đổi Sheet thành công khai để xử lý lỗi này. Gõ URL /exec trên trình duyệt thấy POST_REQUIRED là bình thường, không có nghĩa kết nối đầy đủ đã được kiểm thử.

## Tab Properties

Mỗi dòng là một BĐS; giữ nguyên tên cột. Format các cột mã/giá/diện tích/mặt tiền thành Plain text nếu cần giữ cách viết. Bản mẫu nhập liệu không có dòng chào bán thật: `properties-template.csv`.

| Cột | Nhập liệu |
| --- | --- |
| `id` | Mã duy nhất như STN-101; chỉ chữ không dấu, số, gạch ngang hoặc dưới; không đổi sau khi xuất bản |
| `title` | Tiêu đề sản phẩm |
| `category` | Chính xác một trong: Thổ Cư/Nhà Phố; Hotel/Motel; Đất Vàng; Biệt Thự/Liền Kề |
| `street`, `ward`, `city` | Phố, phường, thành phố; không nhập số nhà cần giữ kín |
| `area`, `frontage` | Số hiển thị không thêm đơn vị, ví dụ 180 và 7.5 |
| `price` | Chuỗi hiển thị do anh duyệt, ví dụ `8x tỷ đồng`, `Nhỉnh 15x tỷ đồng`; không tự suy ra giá chính xác |
| `image` | URL thumbnail; trống thì dùng ảnh đầu tiên |
| `image_1`…`image_4` | Ít nhất bốn URL ảnh; có thể thêm cột image_5…image_24 |
| `description` | Nội dung bài, xuống dòng trong ô bằng Alt+Enter; dùng văn bản, không HTML |
| `seo_title`, `seo_description`, `seo_keywords` | SEO từng bài; trống title/description thì server tạo từ dữ liệu sản phẩm |
| `og_title`, `og_description`, `og_image` | Tiêu đề/mô tả/ảnh khi chia sẻ mạng xã hội; trống dùng mặc định bài |
| `tiktok_caption` | Kho nội dung caption cho đội đăng TikTok; không tự đăng TikTok, không có thẻ web riêng bảo đảm SEO TikTok |
| `published` | TRUE để hiện; FALSE để ẩn |
| `created_at` | ISO timestamp, ví dụ 2026-11-14T01:00:00.000Z; trigger điền lần đầu khi sửa dòng có id |

Bài thiếu mã hợp lệ, danh mục, tiêu đề hoặc ít nhất bốn ảnh bị bỏ qua. Dữ liệu mới nhất sắp trước theo created_at; ngày không hiển thị. Khi import hàng loạt, trigger onEdit có thể không chạy: tự điền created_at. Không dùng thao tác sắp hàng Sheet thay cho ngày đăng. Tránh ảnh trùng. Chỉ publish hồ sơ và ảnh đã được anh xác minh.

Ảnh cần là URL HTTPS trực tiếp có thể xem không đăng nhập, hoặc `/assets/ten-anh.webp`. Không dùng link Google Drive dạng trang chia sẻ/view. Google Sheets lưu **đường dẫn ảnh**, không phải kho upload ảnh. Có thể dùng dịch vụ lưu ảnh/CDN hoặc thêm tệp vào public/assets rồi push GitHub; sau đó đổi URL trên Sheet. Tên tệp không dấu/không khoảng trắng, ưu tiên WebP/JPEG khoảng 1600–2000 px và vài trăm KB. Đổi tên tệp khi thay ảnh để tránh cache cũ.

## Tab Settings

Hai cột `key`, `value`. Chỉ sửa value, giữ key. setup đã điền mọi khóa mặc định; [05-CMS-FIELDS.md](05-CMS-FIELDS.md) liệt kê khóa và nội dung để dễ tìm.

- `header_text_*`, `hero_text_*`, `intro_text_*`, `collection_text_*`, `advisor_text_*`, `contact_text_*`, `footer_text_*`: nội dung biên tập trang chủ/khung chung.
- `ticker_text_01`: toàn bộ một dòng chữ chạy.
- `image_01`, `image_06`: logo header/footer; `image_02`…`image_04`: ba ảnh hero; `image_05`: ảnh khu vực tư vấn. `image_NN_alt`: mô tả ảnh tương ứng.
- `product_*`: nhãn giá, câu liên hệ, chữ nút, lời nhắc cuối bài và tiêu đề phần chung của sản phẩm.
- `seo_*`, `og_*`: thông tin SEO/chia sẻ trang chủ.
- `privacy_text`: chính sách xử lý thông tin do chủ website hoàn thiện trước khi bật nhận lead.

Nội dung công khai cập nhật sau tối đa khoảng 60 giây cache mỗi instance và tải lại trang. Các nhãn kỹ thuật (pause, điều hướng), danh mục chuẩn, địa chỉ tel/Zalo, cấu trúc bố cục và màu giao diện nằm trong code; Sheet không phải trình kéo thả. Đổi chữ số Hotline trên Sheet **không** tự thay href điện thoại: nếu đổi số thật, phải cập nhật cả liên kết trong code và ADMIN_EMAIL nếu cần. Bản này đã cố định liên kết đúng số 0916372468 theo yêu cầu.

## Tab Leads và email

Lưu mã tiếp nhận, timestamp UTC, họ tên, số điện thoại, email, nhu cầu, ngân sách, nội dung, đồng ý liên hệ và trạng thái email. UTC cộng 7 giờ là giờ Việt Nam. Email gửi tới **nghungson@gmail.com**, bằng tài khoản sở hữu Apps Script.

`sent`: MailApp chấp nhận gửi; vẫn cần kiểm tra hộp thư/Spam để xác nhận nhận thư. `pending`/`queued`: đã lưu, đang chờ gửi. Trigger xử lý tối đa 10 dòng mỗi lần, mỗi 5 phút, tối đa 5 lần lỗi gửi mỗi dòng. Hết quota thì chờ quota hồi phục. Sau khi sửa lỗi, quản trị có thể đặt email_attempts về 0, email_status thành queued rồi chạy retryPendingEmails. Không tự sửa fingerprint/request_id. Không xóa lead chỉ vì chưa thấy email.

Google giới hạn quota theo loại tài khoản; không bảo đảm email tức thì hoặc không bao giờ lỗi. Hiếm khi tiến trình dừng đúng sau khi gửi nhưng trước khi ghi trạng thái, lần thử lại có thể tạo email trùng; mã tiếp nhận giúp đối chiếu. Chống trùng bản ghi dựa trên cùng request_id; cùng số điện thoại bị giới hạn gửi mới trong 60 giây.

Nguồn: https://developers.google.com/apps-script/guides/web · https://developers.google.com/apps-script/concepts/deployments · https://developers.google.com/apps-script/guides/services/quotas
