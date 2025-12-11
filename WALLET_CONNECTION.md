# Cara Connect Wallet

Aplikasi ini sudah dilengkapi dengan fitur connect wallet menggunakan OnchainKit dan Farcaster Mini App SDK.

## Cara Menggunakan

### 1. **Di Farcaster Mini App (Base App)**
- Buka aplikasi di Base App atau Farcaster
- Wallet akan otomatis terhubung karena menggunakan Mini App SDK
- Tidak perlu klik tombol connect wallet

### 2. **Di Browser Desktop/Web**
- Klik tombol **"Connect Wallet"** di pojok kanan atas
- Pilih wallet yang ingin digunakan:
  - Coinbase Wallet
  - MetaMask
  - WalletConnect
  - Atau wallet lainnya yang didukung
- Setujui koneksi di wallet Anda
- Wallet akan terhubung dan alamat wallet akan ditampilkan

## Fitur yang Tersedia

✅ **Auto Connect**: Wallet otomatis terhubung saat membuka di Mini App  
✅ **Multiple Wallets**: Mendukung berbagai wallet (Coinbase, MetaMask, dll)  
✅ **Base Chain**: Terhubung ke Base network secara default  
✅ **Wallet Info**: Menampilkan alamat wallet yang terhubung  

## Troubleshooting

**Wallet tidak bisa connect?**
1. Pastikan Anda menggunakan browser yang mendukung Web3 (Chrome, Brave, dll)
2. Pastikan extension wallet sudah terinstall
3. Refresh halaman dan coba lagi
4. Pastikan environment variable `NEXT_PUBLIC_ONCHAINKIT_API_KEY` sudah di-set

**Di Mini App tidak auto connect?**
1. Pastikan aplikasi dibuka melalui Base App atau Farcaster
2. Pastikan Mini App SDK sudah terkonfigurasi dengan benar
3. Cek console untuk error messages

## Konfigurasi

Wallet connection dikonfigurasi di `app/rootProvider.tsx`:
- Chain: Base
- Auto Connect: Enabled untuk Mini App
- Wallet Display: Modal

