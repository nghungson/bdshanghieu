# 03 — Triển khai Vercel và kết nối tên miền

GitHub chứa code, Vercel chạy Express/API. Hướng dẫn áp dụng cho gói này; không bật GitHub Pages. Chưa có thao tác triển khai hoặc DNS nào được thực hiện trên tài khoản của anh.

## Triển khai bản demo trước

1. Đăng nhập Vercel, Add New → Project → Import Git Repository → chọn repo bdshanghieu của anh.
2. Chỉ cấp quyền repo cần dùng. Root Directory là thư mục có package.json (thường để trống nếu ở gốc).
3. Framework: Express; Node.js: 24.x. Install Command: `npm ci --include=dev`. Build Command: `npm run build`. Không đặt Output Directory thành dist/public; đây là server Express, không phải static export.
4. Environment Variables cho lần đầu: `DEMO_MODE=true`, `INDEXABLE=false`, `PRIVACY_APPROVED=false`. Đặt SITE_URL bằng origin HTTPS triển khai mà Vercel cung cấp; nếu chưa biết, có thể dùng https://www.bdshanghieu.net trong lần demo đầu, sau đó đổi cho khớp khi thử form.
5. Deploy. Kiểm tra Build logs: 40 tests pass, sau đó trạng thái Ready. Mở URL Vercel cấp và thử giao diện. Nếu thiếu file template/content, kiểm tra vercel.json còn includeFiles và repo không bị lồng thư mục.

Vercel Hobby dành cho cá nhân/phi thương mại theo tài liệu nhà cung cấp. Website môi giới kinh doanh nên dùng gói cho phép thương mại, chẳng hạn Pro, và kiểm tra giá hiện hành trước khi đăng ký. Không có gói trả phí nào được mua trong lần bàn giao này.

## Gắn bdshanghieu.net và www.bdshanghieu.net

1. Project → Settings → Domains → thêm cả `www.bdshanghieu.net` và `bdshanghieu.net`.
2. Chọn www làm địa chỉ chính. Cấu hình domain gốc redirect sang www trong Vercel nếu có tùy chọn; ứng dụng cũng hỗ trợ chuyển 308 khi CANONICAL_REDIRECT=true.
3. Mở trang quản lý DNS tại nơi anh mua/quản lý domain. Sao lưu bảng DNS trước khi sửa. Điền **giá trị đúng mà Vercel hiển thị cho project này**, không chép IP/CNAME từ một bài viết cũ.

| Host | Loại thường gặp | Giá trị |
| --- | --- | --- |
| @ / bdshanghieu.net | A (hoặc loại dashboard yêu cầu) | IP Vercel đang hiển thị |
| www | CNAME | Đích CNAME riêng Vercel đang hiển thị |
| Host xác minh nếu được yêu cầu | TXT | Chuỗi xác minh của Vercel |

Chỉ xử lý bản ghi A/AAAA/CNAME cũ xung đột của hai host này. Giữ MX, SPF, DKIM, DMARC và TXT dịch vụ khác để email tiếp tục chạy. Không cần chuyển nameserver nếu chỉ dùng DNS tại nhà cung cấp hiện tại. Nếu dùng Cloudflare DNS, giai đoạn xác minh có thể cần DNS only theo hướng dẫn Vercel.

4. Chờ Vercel báo Valid Configuration cho cả hai; thời gian DNS phụ thuộc TTL. HTTPS được cấp sau khi domain xác minh thành công. Không bỏ qua cảnh báo chứng chỉ của trình duyệt.
5. Thử `https://bdshanghieu.net` chuyển về `https://www.bdshanghieu.net`; thử đường dẫn một sản phẩm để chắc redirect giữ nguyên path. Thử cả HTTP để xác nhận hosting chuyển HTTPS.

## Turnstile chống spam và bật CRM

Trong Cloudflare Dashboard → Turnstile, tạo widget cho hostname `www.bdshanghieu.net` và `bdshanghieu.net`, chế độ Managed. Site key công khai; secret key chỉ lưu ở Vercel. Nếu thử trên domain Preview, thêm **đúng hostname đó** vào widget và biến môi trường Preview; không dùng wildcard origin.

Sau khi cài Google Sheet theo tài liệu 02, đặt biến môi trường Vercel **Production**:

| Tên | Giá trị |
| --- | --- |
| SITE_URL | https://www.bdshanghieu.net (không có path, dấu / cuối có thể bỏ) |
| DEMO_MODE | false |
| INDEXABLE | false trong giai đoạn nghiệm thu, true sau khi dữ liệu thật sẵn sàng |
| CANONICAL_REDIRECT | true |
| PRIVACY_APPROVED | true chỉ sau khi điền và duyệt privacy_text |
| GOOGLE_APPS_SCRIPT_URL | URL Web App /exec từ Apps Script |
| GOOGLE_APPS_SCRIPT_SECRET | Cùng chuỗi API_SECRET đã đặt trong Script Properties |
| TURNSTILE_SITE_KEY | Site key widget |
| TURNSTILE_SECRET_KEY | Secret key widget |
| TURNSTILE_HOSTNAMES | www.bdshanghieu.net,bdshanghieu.net |
| REQUIRE_TURNSTILE | true |
| ALLOWED_ORIGINS | Để trống khi khách gửi tại www; chỉ thêm origin HTTPS chính xác khi cần staging |

Redeploy sau khi đổi biến. Không đặt biến NODE_ENV thành development trên hosting. Bản production luôn bắt buộc xác minh Turnstile dù REQUIRE_TURNSTILE bị đặt false. API_SECRET và Turnstile secret không được đưa vào Sheet công khai, source GitHub hoặc tên biến dành cho client.

Mỗi môi trường Preview dùng cấu hình riêng; an toàn nhất để demo/noindex. Nếu muốn kiểm thử CRM trên Preview, dùng một Sheet thử riêng, SITE_URL/origin/Turnstile hostname khớp URL Preview, tránh ghi khách thử vào kho thật. Không bật INDEXABLE cho Preview.

Mở `/api/health`: `mode` phải là live, `leadsEnabled` phải true sau khi đủ cấu hình. Đây chỉ là kiểm tra cấu hình, không kiểm tra email và Sheets. Phải gửi một yêu cầu thử có tên “KIỂM THỬ WEBSITE”, kiểm tra dòng mới trong Leads và thư trong hộp thư admin. Xem checklist tài liệu 04.

Sau nghiệm thu: đặt INDEXABLE=true, redeploy, mở `/robots.txt`, `/sitemap.xml`, kiểm tra canonical trong View Source. Đăng ký Google Search Console cho domain, xác minh bằng TXT rồi gửi sitemap. Chia sẻ lại link trên Facebook/Zalo để kiểm tra ảnh OG; mạng xã hội có cache riêng. Nội dung tiktok_caption được dùng thủ công khi đăng TikTok; website không tự kết nối tài khoản TikTok/Meta.

## Nếu có lỗi

- Trang 503: kiểm tra Web App URL /exec, API_SECRET khớp, quyền triển khai, Apps Script Executions và Vercel logs. Không in secret hoặc toàn bộ thông tin khách vào log.
- Kho trống: kiểm tra published=TRUE, đủ bốn ảnh, đúng mã/danh mục; đợi cache khoảng 60 giây, tải lại.
- Form bị khóa: kiểm tra DEMO_MODE, PRIVACY_APPROVED và hai khóa Turnstile.
- Form báo xác minh: hostname/action/widget phải đúng; thử trình duyệt bình thường, không bỏ CAPTCHA server.
- Form báo không lưu: kiểm tra Leads bằng mã tiếp nhận trước khi tạo yêu cầu mới; cùng nội dung có thể gửi lại để giữ ID và tránh nhân đôi.
- Code mới lỗi: rollback bản Vercel trước, sau đó sửa trên nhánh riêng. Rollback code không rollback dữ liệu Sheet.

Nguồn chính thức:
- https://vercel.com/docs/frameworks/backend/express
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://vercel.com/docs/plans/hobby
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
