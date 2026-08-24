# MAISON Admin

Trang quản trị của hệ thống thương mại điện tử MAISON, xây dựng bằng Angular 22.
Ứng dụng dùng để quản lý dashboard, sản phẩm, danh mục, đơn hàng, giao dịch,
khách hàng, cấu hình thanh toán và tin nhắn liên hệ.

## Vai trò trong hệ thống

| Thành phần | URL local | Repository |
| --- | --- | --- |
| Backend API | `http://localhost:3000` | [be-nestjs](https://github.com/kenzings-ng/be-nestjs) |
| Guest frontend | `http://localhost:4200` | [guest-fe-angular](https://github.com/kenzings-ng/guest-fe-angular) |
| Admin frontend | `http://localhost:4201` | Repository này |

> Angular mặc định dùng cổng `4200`. README này chạy admin ở `4201` để có thể
> mở đồng thời với guest frontend.

## Yêu cầu môi trường

- Node.js `^22.22.3`, `^24.15.0` hoặc `>=26.0.0`.
- npm; lockfile hiện được tạo bằng npm `11.12.1`.
- Backend API đã chạy tại `http://localhost:3000`.

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

## Quick Start

### 1. Clone và cài dependency

```bash
git clone https://github.com/kenzings-ng/admin-fe-angular.git
cd admin-fe-angular
npm ci
```

Dùng `npm ci` khi clone mới để cài đúng phiên bản trong `package-lock.json`.
Chỉ dùng `npm install` khi chủ động thay đổi dependency.

### 2. Tạo cấu hình local

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Giá trị local tối thiểu:

```dotenv
API_URL=http://localhost:3000
```

Sinh file runtime config mà trình duyệt sẽ đọc:

```bash
npm run config:runtime
```

Lệnh trên tạo `public/env.js`. Cả `.env` và `public/env.js` đều không được
commit vào Git.

### 3. Chạy development server

```bash
npm start -- --port 4201
```

Mở [http://localhost:4201](http://localhost:4201).

Nếu chỉ chạy riêng admin và cổng `4200` đang trống, có thể dùng `npm start`.

### 4. Đăng nhập admin

Backend tự tạo tài khoản admin từ các biến sau trong `be-nestjs/.env` ở lần
khởi động đầu tiên:

```dotenv
ADMIN_EMAIL=admin@shop.com
ADMIN_PASSWORD=change-me
ADMIN_NAME=Administrator
```

Hãy dùng đúng email/password đã cấu hình ở backend. Việc đổi các biến sau khi
tài khoản đã được tạo không tự cập nhật tài khoản cũ trong MongoDB.

## Chạy cả hệ thống

Mở ba terminal:

```bash
# Terminal 1 — backend
cd be-nestjs
npm run start:dev
```

```bash
# Terminal 2 — storefront
cd guest-fe-angular
npm start
```

```bash
# Terminal 3 — admin
cd admin-fe-angular
npm start -- --port 4201
```

Thứ tự khuyến nghị: chạy MongoDB → backend → hai frontend.

## Runtime configuration

`API_URL` được đọc từ `/env.js` trước khi Angular khởi động, không được đóng
cứng vào bundle. Vì vậy có thể đổi backend URL sau khi build mà không build lại:

```bash
API_URL=https://api.example.com \
  npm run config:runtime -- --output dist/admin-fe/browser/env.js
```

`env.js` được phục vụ công khai. Chỉ đặt thông tin public như API base URL
trong file này; không đặt password, token hoặc secret.

## Scripts

| Lệnh | Mô tả |
| --- | --- |
| `npm start` | Chạy Angular development server ở cổng mặc định `4200`. |
| `npm start -- --port 4201` | Chạy admin ở cổng khuyến nghị `4201`. |
| `npm run config:runtime` | Sinh `public/env.js` từ `.env` hoặc process environment. |
| `npm run build` | Tạo production build trong `dist/admin-fe/browser`. |
| `npm run watch` | Build development và theo dõi thay đổi. |
| `npm test -- --watch=false` | Chạy unit test một lần bằng Vitest. |
| `npm test` | Chạy unit test ở chế độ mặc định của Angular test builder. |

## Build production

```bash
API_URL=https://api.example.com npm run config:runtime
npm run build
```

Output:

```text
dist/admin-fe/browser
```

Backend phải cho phép origin của admin qua CORS.

## Cấu trúc dự án

```text
src/app/
├── core/          # Models, services, guards và HTTP interceptor
├── features/      # Các màn hình nghiệp vụ được lazy load
├── layout/        # Sidebar, topbar và app shell
└── shared/        # UI components, chart và toast dùng chung
```

## Xử lý sự cố

| Triệu chứng | Cách kiểm tra |
| --- | --- |
| Trang trắng hoặc lỗi `Missing API_URL runtime configuration` | Chạy `npm run config:runtime` và kiểm tra `public/env.js`. |
| `EADDRINUSE: 4200` | Chạy admin bằng `npm start -- --port 4201`. |
| Request báo `ERR_CONNECTION_REFUSED` | Kiểm tra backend đang chạy tại URL trong `.env`. |
| `401 Unauthorized` | Đăng nhập lại; access token có thể đã hết hạn. |
| Bị đăng xuất ngay sau login | Tài khoản không có role `admin` hoặc backend trả session không hợp lệ. |
| Cài dependency báo `Unsupported engine` | Đổi sang phiên bản Node.js được liệt kê ở phần yêu cầu môi trường. |
| Đổi `API_URL` nhưng app vẫn gọi URL cũ | Chạy lại `npm run config:runtime` và reload trình duyệt. |

## Nguyên tắc bảo mật

- Không commit `.env`, `public/env.js`, token hoặc credential.
- Không đặt secret trong Angular source; mọi mã frontend đều có thể được người
  dùng tải xuống và đọc.
- Không dùng tài khoản/password mẫu trong production.
