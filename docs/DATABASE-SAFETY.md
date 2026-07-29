# An toàn Database — Quy tắc migrate & backup

Tài liệu này ra đời sau sự cố `prisma migrate dev` reset sạch schema `public` trên Neon
và làm mất dữ liệu. Đọc kỹ trước khi đụng vào schema.

## Vì sao lần trước mất data

Có 2 nguyên nhân cộng lại:

1. `.gitignore` đang ignore `prisma/migrations/` → lịch sử migration không được lưu.
   Khi chạy `migrate dev`, Prisma không thấy lịch sử để đối chiếu nên chọn **reset** toàn bộ.
2. `package.json` để `db:migrate = prisma migrate dev` — lệnh này được thiết kế cho môi
   trường DEV, và **sẽ reset DB khi phát hiện lệch (drift)**. Chạy thẳng lên DB production
   (có dữ liệu thật) là cực kỳ nguy hiểm.

Cả hai đã được sửa (xem bên dưới).

## Quy tắc vàng

- **KHÔNG bao giờ** chạy thẳng `prisma migrate dev` trên DB production.
- **LUÔN** commit thư mục `prisma/migrations/` vào git.
- **LUÔN** backup trước khi thay đổi schema (đã tự động hoá — xem lệnh).
- Thay đổi nhỏ (thêm bảng/cột nullable) → ưu tiên `db:push` (không reset).
- Thay đổi có kiểm soát, có version → tạo migration ở dev rồi `migrate deploy` lên prod.

## Các lệnh đã wire sẵn (package.json)

| Lệnh | Việc nó làm | Dùng khi |
|------|-------------|----------|
| `npm run db:backup` | Snapshot toàn bộ bảng ra `backups/backup-<time>.json` | Bất cứ lúc nào muốn lưu ảnh chụp |
| `npm run db:push` | **Backup trước**, rồi `prisma db push` (áp schema, không reset) | Thêm bảng/cột đơn giản — an toàn nhất |
| `npm run db:migrate` | **Backup trước**, rồi `prisma migrate deploy` (áp migration đã commit) | Chạy trên production |
| `npm run db:migrate:new` | **Backup trước**, rồi `prisma migrate dev` (tạo migration mới) | Chỉ ở môi trường DEV / Neon dev branch |

Điểm mấu chốt: mọi lệnh chạm vào schema đều **backup trước**. Nếu backup lỗi, lệnh migrate
phía sau sẽ **không chạy** (script backup exit code khác 0).

## Khôi phục dữ liệu

### Cách 1 — Neon Instant Restore (ưu tiên, nhanh & nguyên trạng)

1. Neon Console → project → branch → tab **Backup & Restore**.
2. Chọn **From history**, dùng **Time Travel Assist** soi đúng thời điểm trước sự cố.
3. Chọn timestamp → **Restore**. Neon tự tạo backup branch `..._old_...` để lùi lại nếu cần.

> Cửa sổ lịch sử phụ thuộc gói: **Free = 6 giờ**, **Launch = tối đa 7 ngày**, **Scale = tối đa 30 ngày**.
> Nếu dữ liệu quan trọng, nên nâng history window trong **Project settings → Storage / History retention**.

### Cách 2 — File JSON backup (tham chiếu / khôi phục thủ công)

File trong `backups/` chứa toàn bộ dữ liệu tại thời điểm backup. Dùng để tra cứu hoặc
viết script chèn lại từng bảng khi cần.

## Nên bật thêm trên Neon (làm 1 lần)

- **Tăng History window** lên mức tối đa của gói (Project settings → Storage).
- **Dùng Neon branching cho dev**: tạo 1 branch riêng để thử migration, giữ branch chính
  (production) sạch. Migration test xong mới `migrate deploy` lên branch chính.

## Tự động hoá backup định kỳ (tuỳ chọn)

Nếu muốn backup tự động hằng ngày (không phụ thuộc thao tác tay), 2 cách phổ biến:

- **Vercel Cron** → gọi 1 API route chạy `db:backup` logic rồi đẩy file lên Vercel Blob / S3.
- **GitHub Actions** (nếu repo trên GitHub) → job theo lịch chạy `npm run db:backup`, lưu
  artifact. Đặt `DATABASE_URL` trong GitHub Secrets, không hardcode.

Kết hợp với Neon Instant Restore là đủ an toàn cho giai đoạn này.
