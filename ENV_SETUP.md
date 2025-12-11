# Konfigurasi Environment Variables

Aplikasi ini memerlukan environment variables untuk berfungsi dengan baik. Ikuti langkah-langkah berikut:

## 1. Buat File .env.local

File `.env.local` sudah dibuat di root project. Edit file ini dan tambahkan konfigurasi berikut:

```env
# OnchainKit API Key - WAJIB untuk Connect Wallet
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# Production URL - Update setelah deploy
NEXT_PUBLIC_URL=http://localhost:3000
```

## 2. Dapatkan OnchainKit API Key

1. Buka [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
2. Login dengan akun Coinbase Anda
3. Buat project baru atau pilih project yang sudah ada
4. Salin API Key
5. Paste ke file `.env.local` di `NEXT_PUBLIC_ONCHAINKIT_API_KEY`

## 3. Update Production URL

Setelah deploy ke Vercel, update `NEXT_PUBLIC_URL` dengan URL production Anda:
- Contoh: `https://ber4mins.vercel.app`

## 4. Set Environment Variables di Vercel

Untuk production, tambahkan environment variables di Vercel Dashboard:

1. Buka Vercel Dashboard → Project Settings → Environment Variables
2. Tambahkan:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY` = your_api_key
   - `NEXT_PUBLIC_URL` = https://ber4mins.vercel.app

## Troubleshooting

**Connect Wallet tidak muncul?**
- Pastikan `NEXT_PUBLIC_ONCHAINKIT_API_KEY` sudah di-set
- Restart development server setelah menambahkan .env.local

**Error di console?**
- Cek apakah semua environment variables sudah di-set dengan benar
- Pastikan tidak ada spasi di awal/akhir nilai

## Catatan

- File `.env.local` sudah di-ignore oleh git (tidak akan di-commit)
- Jangan commit file .env.local ke repository
- Gunakan Vercel Environment Variables untuk production

