# Odin Weather App 🌤️

Aplikasi cuaca berbasis web yang menampilkan informasi cuaca saat ini dan prediksi 5 hari ke depan untuk kota manapun di dunia.

## Fitur

- **Cari Kota** — cari cuaca kota manapun di dunia
- **Current Weather** — suhu, deskripsi cuaca, feels like, humidity, wind speed
- **5-Day Forecast** — prediksi cuaca 5 hari ke depan
- **Loading & Error Handling** — spinner loading + pesan error yang informatif
- **Responsive** — tampilan rapi di HP dan desktop

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Webpack (module bundler)
- OpenWeatherMap API
- dotenv-webpack (environment variables)
- GitHub Pages (deployment)

## Cara Jalankan di Lokal

### Prasyarat
- Node.js (v18+)
- API Key dari [OpenWeatherMap](https://openweathermap.org/api)

### Setup

```bash
# Clone repo
git clone https://github.com/username/odin-weather.git
cd odin-weather

# Install dependencies
npm install

# Buat file .env (isi dengan API Key kamu)
echo "API_KEY=isi_api_key_kamu" > .env
echo "API_BASE_URL=https://api.openweathermap.org/data/2.5" >> .env
```

### Development
```bash
npm run dev
```
Buka `http://localhost:3000`

### Build Production
```bash
npm run build
```
Hasil build di folder `dist/`

## Cara Deploy

```bash
npm run deploy
```

Aplikasi akan terdeploy ke GitHub Pages di:
`https://username.github.io/odin-weather/`

## Struktur Proyek

```
odin-weather/
├── src/
│   ├── index.html       # Halaman utama
│   ├── style.css        # Styling
│   └── script.js        # Logic JavaScript
├── dist/                # Hasil build (auto-generated)
├── docs/
│   └── manual.md        # Buku panduan lengkap
├── .env                 # Environment variables (RAHASIA!)
├── .env.example         # Template .env
├── webpack.config.js    # Konfigurasi Webpack
└── package.json         # Dependensi & scripts
```

## Buku Panduan

Panduan lengkap dari NOL sampai jadi ada di **[docs/manual.md](docs/manual.md)** — cocok buat pemula yang mau belajar Fetch API dan Webpack.

## Lisensi

ISC
