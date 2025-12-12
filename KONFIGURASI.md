# 📋 Konfigurasi Lengkap Website

## ✅ Fitur yang Sudah Ditambahkan

1. **Connect Wallet** - Tombol di pojok kanan atas
2. **Dark Mode Toggle** - Tombol di pojok kiri atas (ikon 🌙/☀️)
3. **Track Accomplishments** - Fitur utama aplikasi

## 🔧 Konfigurasi yang Diperlukan

### 1. File .env.local

Pastikan file `.env.local` ada di root project dengan isi:

```env
# WAJIB: OnchainKit API Key untuk Connect Wallet
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here

# WAJIB: URL aplikasi
NEXT_PUBLIC_URL=http://localhost:3000
```

### 2. Cara Mendapatkan OnchainKit API Key

1. Buka https://portal.cdp.coinbase.com/
2. Login dengan akun Coinbase
3. Buat project baru atau pilih project yang ada
4. Salin API Key
5. Paste ke file `.env.local`

### 3. Restart Development Server

Setelah menambahkan/update `.env.local`:
```bash
# Stop server (Ctrl+C)
# Jalankan lagi
npm run dev
```

## 🎯 Fitur yang Harus Terlihat di Website

### Di Pojok Kiri Atas:
- ✅ **Dark Mode Toggle** - Tombol dengan ikon 🌙 (light mode) atau ☀️ (dark mode)
- Klik untuk beralih antara light dan dark mode

### Di Pojok Kanan Atas:
- ✅ **Connect Wallet Button** - Tombol "Connect Wallet"
- Klik untuk connect wallet (Coinbase, MetaMask, dll)
- Setelah connect, akan muncul alamat wallet

### Di Tengah:
- ✅ **Title**: "What Did You Accomplish?"
- ✅ **Subtitle**: "Hey there! Track your wins..."
- ✅ **Input Field**: Untuk menambah accomplishment
- ✅ **Add Button**: Tombol kuning untuk submit

## 🐛 Troubleshooting

### Connect Wallet Tidak Muncul?
1. ✅ Pastikan `NEXT_PUBLIC_ONCHAINKIT_API_KEY` sudah di-set di `.env.local`
2. ✅ Restart development server setelah update `.env.local`
3. ✅ Cek browser console untuk error messages

### Dark Mode Toggle Tidak Terlihat?
1. ✅ Pastikan sudah di pojok kiri atas
2. ✅ Cek apakah ada error di console
3. ✅ Refresh halaman

### Fitur Lain Tidak Muncul?
1. ✅ Pastikan semua file sudah di-save
2. ✅ Restart development server
3. ✅ Clear browser cache (Ctrl+Shift+R)
4. ✅ Cek browser console untuk errors

## 📝 Checklist Konfigurasi

- [ ] File `.env.local` sudah dibuat
- [ ] `NEXT_PUBLIC_ONCHAINKIT_API_KEY` sudah di-set
- [ ] `NEXT_PUBLIC_URL` sudah di-set
- [ ] Development server sudah di-restart
- [ ] Browser sudah di-refresh
- [ ] Tidak ada error di console

## 🚀 Untuk Production (Vercel)

Tambahkan environment variables di Vercel Dashboard:
1. Buka Vercel Dashboard → Project Settings → Environment Variables
2. Tambahkan:
   - `NEXT_PUBLIC_ONCHAINKIT_API_KEY` = your_api_key
   - `NEXT_PUBLIC_URL` = https://ber4mins.vercel.app

## 📞 Butuh Bantuan?

Jika masih ada masalah:
1. Cek file `.env.local` sudah benar
2. Cek browser console untuk error
3. Pastikan semua dependencies sudah terinstall (`npm install`)


