# Photobooth

Aplikasi web photobooth dengan dashboard admin. Lihat backlog plan untuk roadmap lengkap.

## Prasyarat
- Node.js 20+
- Docker + Docker Compose (hanya untuk PostgreSQL)

## Menjalankan secara lokal
```bash
cp .env.example .env        # lalu ubah SESSION_SECRET dan SEED_OWNER_PASSWORD
docker compose up -d        # PostgreSQL
npm install
npm run db:push             # buat tabel
npm run db:seed             # akun owner, paket, booth contoh
npm run dev
```

Cek: buka http://localhost:3000/api/health, hasilnya harus `{"status":"ok","db":"up"}`.

Foto pada development disimpan di folder lokal `./storage`; untuk produksi nanti memakai
storage S3-compatible (mis. Cloudflare R2).

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan TypeScript |
| `npm run db:studio` | Prisma Studio |

## Status sprint
- [x] Sprint 0 Fondasi
- [ ] Sprint 1 Admin inti
