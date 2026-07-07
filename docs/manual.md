# 📘 Panduan Lengkap Aplikasi Weather
## Dari NOL sampai Fetch API (dengan Webpack + .env)

---

# BAB 1 — Pengantar

## 1.1 Apa yang Akan Kita Buat?

Kita akan membuat **Aplikasi Weather (Cuaca)** berbasis web dengan fitur:

- **Cari kota** — user ngetik nama kota, langsung dapet info cuaca
- **Current Weather** — suhu, cuaca (cerah/berawan/dll), feels like, humidity, wind speed
- **5-Day Forecast** — prediksi cuaca 5 hari ke depan
- **Loading & Error Handling** — ada animasi loading, pesan error kalau kota gak ditemukan

## 1.2 Apa Itu API?

**API** (Application Programming Interface) adalah "pelayan" yang menghubungkan aplikasi kita dengan data dari server lain.

Analoginya:
- Kamu di restoran → **Frontend** (aplikasi kita)
- Pelayan → **API**
- Dapur → **Server** (punya data cuaca)

Kamu bilang ke pelayan: *"Saya mau lihat cuaca di Jakarta"*
Pelayan ke dapur, ambil data, lalu bawain ke meja kamu.

**Cara kerja:**
```
Browser (kamu)  →  FETCH data  →  Server OpenWeatherMap
                          ↓
              Server ngirim JSON (data cuaca)
                          ↓
Browser (kamu)  →  Terima data  →  Tampilkan di UI
```

## 1.3 Apa Itu JSON?

**JSON** (JavaScript Object Notation) — format data yang mirip object JavaScript.

Contoh JSON dari API cuaca:
```json
{
  "name": "Jakarta",
  "main": {
    "temp": 30.5,
    "feels_like": 33.2,
    "humidity": 80
  },
  "weather": [
    {
      "description": "cerah berawan",
      "icon": "02d"
    }
  ],
  "wind": {
    "speed": 4.5
  }
}
```

Kita akan ambil data ini pake **Fetch API**, terus kita tampilkan di halaman web.

## 1.4 Apa Itu Fetch API?

**Fetch API** adalah fitur JavaScript modern buat ngirim request HTTP ke server dan dapetin response.

```js
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);
```

- `fetch(url)` — ngirim permintaan ke server
- `await` — nunggu server ngasih jawaban
- `response.json()` — ubah response jadi object JavaScript

## 1.5 Apa Itu Webpack?

**Webpack** adalah *module bundler*. Gunanya:
1. **Menggabungkan** file JS, CSS, HTML jadi bundle
2. **Memproses** file — misalnya CSS-loader baca file `.css`, Style-loader sisipin ke HTML
3. **Development Server** — auto-reload tiap kali kita ganti kode (`webpack-dev-server`)

Tanpa Webpack, kita harus nulis `<script>` dan `<link>` manual di HTML, dan gak bisa pake `import/export` dengan baik di browser lama. Webpack ngurusin semua itu.

## 1.6 Apa Itu `.env`?

**`.env`** (Environment Variables) — file khusus buat nyimpen data rahasia:
- API Key
- URL Base API
- Konfigurasi lain yang gak boleh bocor

File ini **jangan pernah di-commit ke GitHub**. Nanti kita kasih contoh file `.env.example` sebagai template.

---

# BAB 2 — Persiapan Tools

## 2.1 Install Node.js

**Tujuan:** Node.js diperlukan buat jalanin Webpack.

1. Buka https://nodejs.org
2. Download versi **LTS** (stabil)
3. Install seperti biasa (next-next-finish)

**Test Point:**
```
node --version
npm --version
```
Kalo muncul nomor versi, berarti sukses.

## 2.2 Dapatkan API Key OpenWeatherMap

**Tujuan:** Dapat kunci akses ke data cuaca.

1. Buka https://openweathermap.org/api
2. Klik **Sign In** (atau **Create Account** kalo belum punya)
3. Setelah login, ke **API Keys** tab
4. Kamu akan lihat **Default API Key** (atau bikin baru)
5. **Copy API Key** itu — kita simpen nanti di `.env`

> **Catatan:** API Key gratis bisa butuh beberapa jam sampai aktif setelah bikin akun baru. Kalo masih error, tunggu dulu.

**Test Point:**
Coba tempel link ini di browser (ganti `API_KEY` punyamu):
```
https://api.openweathermap.org/data/2.5/weather?q=Jakarta&units=metric&appid=API_KAMU
```
Kalo muncul data JSON, API Key udah aktif.

## 2.3 Buat Folder Project

**Tujuan:** Siapin folder tempat kita kerja.

Buka terminal/command prompt, terus jalanin:
```bash
cd Desktop/odin
mkdir odin-weather
cd odin-weather
```

---

# BAB 3 — Setup Project & Webpack

## 3.1 Inisialisasi Project

**Tujuan:** Bikin file `package.json` — file konfigurasi project Node.js.

Jalanin:
```bash
npm init -y
```

Perintah `-y` artinya pake default settings, jadi gak perlu diisi manual.

**Penjelasan `package.json`:**
- `name` — nama project
- `version` — versi project
- `main` — entry point (file utama)
- `scripts` — perintah yang bisa dijalanin pake `npm run`
- `devDependencies` — daftar package yang dipake saat development aja
- `dependencies` — daftar package yang dipake di production

**Test Point:** File `package.json` udah ada di folder project.

## 3.2 Install Webpack & Dependencies

**Tujuan:** Install semua package yang diperlukan.

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server html-webpack-plugin css-loader style-loader
```

**Penjelasan tiap package:**
| Package | Fungsi |
|---------|--------|
| `webpack` | Inti Webpack — ngurus bundling file |
| `webpack-cli` | Biar kita bisa jalanin Webpack dari terminal |
| `webpack-dev-server` | Server development — auto-reload kalo file berubah |
| `html-webpack-plugin` | Otomatis bikin file HTML di folder `dist/` dan masukin script bundle |
| `css-loader` | Baca file `.css` dan ubah jadi module yang bisa di-import JS |
| `style-loader` | Sisipin CSS ke halaman HTML lewat `<style>` tag |

**Test Point:** Cek folder `node_modules` udah ada (terisi otomatis), dan `package.json` sekarang punya `devDependencies`.

## 3.3 Install dotenv-webpack

**Tujuan:** Biar kita bisa baca file `.env` dari Webpack.

```bash
npm install --save-dev dotenv-webpack
```

## 3.4 Buat Struktur Folder

Buat folder dan file kosong yang diperlukan:

```bash
mkdir src dist
```

Struktur akhir:
```
odin-weather/
├── node_modules/        # (terisi otomatis)
├── src/
│   ├── index.html       # HTML → kamu buat
│   ├── style.css        # CSS → kamu buat
│   └── script.js        # JS → kamu buat
├── dist/                # Hasil build webpack (otomatis)
├── .env                 # API key → kamu buat (RAHASIA!)
├── .env.example         # Template .env → kamu buat
├── .gitignore
├── package.json
├── package-lock.json
└── webpack.config.js    # → kamu buat
```

## 3.5 Buat `webpack.config.js`

**Tujuan:** Konfigurasi Webpack biar jalan sesuai yang kita mau.

Buat file `webpack.config.js` di root folder (bukan di `src/` — di `odin-weather/`).

Isinya:
```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  // Entry point — file JS utama
  entry: './src/script.js',

  // Output — hasil bundle
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  // Mode development biar gampang debug
  mode: 'development',

  // Module rules — cara webpack proses file
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // Plugin — fitur tambahan webpack
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new Dotenv(),
  ],

  // Dev server — biar auto-reload
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    open: true,
    hot: true,
  },
};
```

**Penjelasan bagian-bagiannya:**

| Bagian | Penjelasan |
|--------|-----------|
| `entry` | File JS mana yang diproses pertama |
| `output.filename` | Nama file hasil bundle (`bundle.js`) |
| `output.path` | Folder hasil bundle (`dist/`) |
| `output.clean` | Bersihin folder `dist/` tiap kali build baru |
| `mode: 'development'` | Mode development — gak di-minify, gampang debug |
| `module.rules[0].test` | Cari file yang namanya `.css` |
| `module.rules[0].use` | Proses pake style-loader dulu, baru css-loader |
| `HtmlWebpackPlugin` | Bikin `index.html` di dist/ pake template dari `src/index.html` |
| `Dotenv` | Bikin variabel di `.env` bisa diakses pake `process.env` |
| `devServer` | Konfigurasi server development |

> **Catatan penting:** Urutan `use` dibaca dari **kanan ke kiri**.
> - `css-loader` dulu — baca file CSS
> - `style-loader` setelahnya — masukin CSS ke halaman
> Urutan di array: `['style-loader', 'css-loader']`

## 3.6 Update Scripts di `package.json`

Buka `package.json`, cari bagian `"scripts"`, ganti isinya jadi:

```json
"scripts": {
  "build": "webpack",
  "dev": "webpack-dev-server",
  "watch": "webpack --watch"
}
```

**Penjelasan:**
- `npm run build` — build sekali, hasilnya di folder `dist/`
- `npm run dev` — jalanin development server (auto-reload di browser)
- `npm run watch` — build terus-terusan tiap file berubah (tanpa server)

**Test Point:**
Jalanin `npm run build`. Kalo sukses, folder `dist/` akan terisi file.

## 3.7 Update `.gitignore`

**Tujuan:** Biar file-file tertentu gak masuk ke GitHub.

Buka file `.gitignore` (kalo belum ada, bikin). Isinya:

```
node_modules
dist
.env
```

**Penjelasan:**
- `node_modules` — berat banget, gak perlu di-commit, tinggal `npm install`
- `dist` — hasil build, tiap orang bisa `npm run build` sendiri
- `.env` — berisi API Key rahasia, JANGAN bocor!

Yang di-commit ke GitHub:
- Source code asli (`src/`)
- Konfigurasi (`webpack.config.js`, `package.json`)
- Template `.env.example` (tanpa nilai rahasia)

---

# BAB 4 — `.env` & Dotenv Webpack

## 4.1 Apa Itu Environment Variables?

**Environment Variables** (variabel lingkungan) adalah cara nyimpen konfigurasi di luar kode:
- API Key
- URL Base
- Pengaturan lain yang beda-beda tiap lingkungan (development vs production)

Dengan `.env`, kita pisahin **konfigurasi** dari **kode**.

## 4.2 Buat File `.env`

**Tujuan:** Nyimpen API Key dan URL Base.

Buat file baru `odin-weather/.env`.

Isinya:
```
API_KEY=abcdef1234567890abcdef1234567890
API_BASE_URL=https://api.openweathermap.org/data/2.5
```

> **PENTING:** Ganti `abcdef...` dengan API Key aslimu dari OpenWeatherMap!
> Format: `NAMA_VARIABEL=value` (tanpa spasi, tanpa tanda petik)

## 4.3 Buat File `.env.example`

**Tujuan:** Template buat developer lain biar tau variabel apa aja yang diperlukan.

Buat file `odin-weather/.env.example`.

Isinya:
```
API_KEY=isi_dengan_api_key_kamu
API_BASE_URL=https://api.openweathermap.org/data/2.5
```

File ini **boleh di-commit ke GitHub** karena isinya cuma template, bukan rahasia.

## 4.4 Cara `.env` Bekerja dengan Dotenv Webpack

**Prosesnya:**

1. Webpack baca file `.env`
2. `Dotenv` plugin bikin semua variabel di `.env` bisa diakses
3. Di kode, kita panggil `process.env.NAMA_VARIABEL`
4. Webpack ganti `process.env.NAMA_VARIABEL` dengan nilai aslinya **saat build**

**Contoh di `script.js` nanti:**
```js
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.API_BASE_URL;
```

> **Catatan:** `process.env` sebenarnya milik Node.js, tapi Dotenv plugin membuatnya berfungsi di kode frontend saat build.

## 4.5 Kenapa `.env` Wajib di `.gitignore`?

Kalo `.env` ke-commit ke GitHub, **API Key kamu bocor** ke publik. Orang jahat bisa:
1. Pake API key kamu gratisan
2. Bikin quota kamu abis
3. Kamu kena tagihan

**Tips:** Cek ulang sebelum commit — pastiin file `.env` gak ikut terdaftar.

**Test Point:**
Jalanin `git status` dan pastiin `.env` gak muncul di daftar file yang siap di-commit.

---

# BAB 5 — Membuat HTML (Struktur UI)

## 5.1 Tujuan

Buat struktur halaman web yang akan menampilkan:
1. **Header** — judul aplikasi
2. **Search Bar** — input buat cari kota
3. **Current Weather** — info cuaca hari ini
4. **Forecast** — prediksi cuaca 5 hari ke depan
5. **Loading & Error** — tempat buat animasi loading dan pesan error

## 5.2 Konsep Semantic HTML

Gunakan tag HTML yang bermakna:
- `<header>` — bagian atas halaman
- `<main>` — konten utama
- `<section>` — kelompok konten yang tematik
- `<form>` — form input
- `<article>` — konten independen (misal: kartu cuaca)

## 5.3 Buat `src/index.html`

Buka `src/index.html` dan tulis struktur dasarnya:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weather App</title>
</head>
<body>
  <!-- Header: judul aplikasi -->
  <header>
    <h1>Weather App</h1>
  </header>

  <!-- Main: konten utama -->
  <main>
    <!-- Search section -->
    <section id="search-section">
      <form id="search-form">
        <input
          type="text"
          id="search-input"
          placeholder="Cari kota..."
          required
        />
        <button type="submit">Cari</button>
      </form>
    </section>

    <!-- Loading indicator -->
    <div id="loading" class="hidden">
      <div class="spinner"></div>
      <p>Memuat data cuaca...</p>
    </div>

    <!-- Error message -->
    <div id="error" class="hidden">
      <p id="error-message"></p>
    </div>

    <!-- Current weather section -->
    <section id="current-weather" class="hidden">
      <h2 id="city-name"></h2>
      <p id="date"></p>
      <div id="weather-main">
        <img id="weather-icon" src="" alt="Icon cuaca" />
        <p id="temperature"></p>
        <p id="weather-description"></p>
      </div>
      <div id="weather-details">
        <div class="detail-item">
          <span class="detail-label">Feels Like</span>
          <span id="feels-like" class="detail-value"></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Humidity</span>
          <span id="humidity" class="detail-value"></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Wind Speed</span>
          <span id="wind-speed" class="detail-value"></span>
        </div>
      </div>
    </section>

    <!-- Forecast section -->
    <section id="forecast" class="hidden">
      <h2>5-Day Forecast</h2>
      <div id="forecast-container">
        <!-- Forecast cards akan diisi JavaScript -->
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    <p>&copy; 2026 Odin Weather App</p>
  </footer>
</body>
</html>
```

**Penjelasan tiap bagian:**

| Elemen | Penjelasan |
|--------|-----------|
| `<form id="search-form">` | Form dengan input + tombol submit. `required` mencegah submit kalo input kosong |
| `class="hidden"` | Class CSS buat nyembunyiin elemen — nanti kita styling |
| `<div id="loading">` | Animasi loading (spinner) |
| `<div id="error">` | Container pesan error |
| `<section id="current-weather">` | Info cuaca saat ini — `id` dipake JavaScript buat isi data |
| `<img id="weather-icon">` | Icon cuaca dari OpenWeatherMap |
| `<div id="forecast-container">` | Container kosong — nanti diisi JavaScript dengan kartu-kartu forecast |
| `class="hidden"` | Dipake buat nyembunyiin section sebelum data dimuat |

## 5.4 Kenapa Pake `class="hidden"`?

Kita mau:
- Awalnya halaman cuma nampilin **header + search bar**
- Begitu user cari kota, baru muncul **loading** → **data cuaca**
- Kalo error, muncul **pesan error**
- Class `hidden` ngatur visibilitas via CSS

**Test Point:**
Buka `dist/index.html` (atau jalanin `npm run dev`).

- Apakah halaman muncul?
- Apakah form search keliatan?
- Apakah section cuaca dan forecast belum keliatan? (karena masih `hidden`)

---

# BAB 6 — Membuat CSS (Styling)

## 6.1 Tujuan

Bikin aplikasi weather keliatan:
- **Rapi dan modern** — layout jelas, warna enak dilihat
- **Responsif** — bagus di HP maupun desktop
- **Animasi loading** — spinner biar user tau lagi proses

## 6.2 Konsep

Kita akan pake:
- **CSS Grid/Flexbox** buat layout
- **CSS Variables** (`:root`) buat warna tema
- **CSS Transitions** buat efek halus
- **Media Queries** buat responsive

## 6.3 Buat `src/style.css`

```css
/* ========== CSS Variables (Tema Warna) ========== */
:root {
  --primary: #4a90d9;
  --primary-dark: #357abd;
  --bg: #f0f4f8;
  --card-bg: #ffffff;
  --text: #333333;
  --text-light: #666666;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --radius: 12px;
}

/* ========== Reset & Global ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ========== Header ========== */
header {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  width: 100%;
  text-align: center;
  padding: 1.5rem 0;
  box-shadow: var(--shadow);
}

header h1 {
  font-size: 1.8rem;
  font-weight: 600;
}

/* ========== Main Container ========== */
main {
  width: 100%;
  max-width: 600px;
  padding: 1.5rem;
}

/* ========== Search Section ========== */
#search-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

#search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: var(--radius);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
}

#search-input:focus {
  border-color: var(--primary);
}

#search-form button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#search-form button:hover {
  background-color: var(--primary-dark);
}

/* ========== Loading Spinner ========== */
#loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ========== Error Message ========== */
#error {
  background-color: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: var(--radius);
  text-align: center;
  margin-bottom: 1rem;
}

/* ========== Hidden Utility ========== */
.hidden {
  display: none !important;
}

/* ========== Current Weather Card ========== */
#current-weather {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

#city-name {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

#date {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

#weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

#weather-icon {
  width: 80px;
  height: 80px;
}

#temperature {
  font-size: 3rem;
  font-weight: 700;
}

#weather-description {
  font-size: 1.1rem;
  color: var(--text-light);
  text-transform: capitalize;
}

/* ========== Weather Details Grid ========== */
#weather-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-label {
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
}

/* ========== Forecast Section ========== */
#forecast h2 {
  margin-bottom: 1rem;
}

#forecast-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.forecast-card {
  background-color: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 1rem;
  text-align: center;
}

.forecast-card .day {
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.forecast-card img {
  width: 40px;
  height: 40px;
}

.forecast-card .temp {
  font-size: 1rem;
  font-weight: 600;
}

/* ========== Footer ========== */
footer {
  margin-top: auto;
  padding: 1rem;
  color: var(--text-light);
  font-size: 0.85rem;
}

/* ========== Responsive (Mobile) ========== */
@media (max-width: 480px) {
  #forecast-container {
    grid-template-columns: repeat(2, 1fr);
  }

  #weather-details {
    grid-template-columns: 1fr;
  }

  #search-form {
    flex-direction: column;
  }

  #temperature {
    font-size: 2.5rem;
  }
}
```

**Penjelasan bagian-bagian penting:**

| CSS | Penjelasan |
|-----|-----------|
| `:root` | Variabel CSS pusat — ganti warna tinggal ubah di sini |
| `* { box-sizing: border-box }` | Biar padding gak nambah ukuran elemen |
| `display: flex / grid` | Layout modern, gantiin float |
| `.spinner` + `@keyframes spin` | Animasi loading — border-top dikasih warna biar kelihatan puter |
| `.hidden` | `display: none !important` — paksa sembunyi (biar gak ketimpa CSS lain) |
| `text-transform: capitalize` | Ubah "cerah berawan" jadi "Cerah Berawan" |
| `@media (max-width: 480px)` | Aturan khusus untuk layar HP — kolomnya numpuk ke bawah |
| `transition` | Efek halus saat hover / focus |

**Test Point:**
Jalanin `npm run dev`. Halaman sekarang udah keliatan cantik:
- Header biru gradien
- Search input dengan border
- Loading spinner (kalo di-unhide)
- Layout card yang rapi

---

# BAB 7 — JavaScript & Fetch API

## 7.1 Tujuan

Buat kode JavaScript yang:
1. Ngirim request ke OpenWeatherMap API
2. Ambil data cuaca (current + forecast)
3. Tampilin data ke halaman HTML
4. Tangani error (kota gak ditemukan, network error, dll)
5. Loading state biar user tau proses

## 7.2 Konsep yang Harus Dipahami

### a. `async / await`

JavaScript bisa jalanin banyak hal bersamaan. Tapi kadang kita perlu **nunggu** sesuatu (misal: nunggu response API).

```js
// async — bilang ke JS: "fungsi ini mengandung await"
async function getData() {
  // await — "tunggu sampai fetch selesai"
  const response = await fetch('url');
  const data = await response.json();
  return data;
}
```

### b. `try / catch`

Buat nangkep error:
```js
try {
  // Coba jalanin kode ini
  const data = await getData();
} catch (error) {
  // Kalo gagal, jalanin ini
  console.log('Error:', error);
}
```

### c. DOM Manipulation

Mengubah isi halaman HTML pake JavaScript:
```js
document.getElementById('city-name').textContent = 'Jakarta';
document.getElementById('temperature').textContent = '30°C';
```

### d. Event Listener

Nangkep aksi user:
```js
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Mencegah form reload halaman
  // ... ambil input, cari cuaca
});
```

## 7.3. Buat `src/script.js`

### Langkah 1: Ambil API Key dari `.env`

Pertama-tama, ambil konfigurasi dari environment variables:

```js
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.API_BASE_URL;
```

### Langkah 2: Fungsi Fetch Cuaca Saat Ini

Buat fungsi khusus buat ambil data cuaca dari API:

```js
async function getCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Kota tidak ditemukan');
  }

  const data = await response.json();
  return data;
}
```

**Penjelasan:**
- `${BASE_URL}/weather` — endpoint cuaca saat ini
- `q=${city}` — parameter nama kota (diambil dari argumen fungsi)
- `units=metric` — pake Celcius (bukan Fahrenheit default)
- `appid=${API_KEY}` — API Key dari `.env`
- `!response.ok` — kalo HTTP status bukan 200 (OK), lempar error
- `response.json()` — ubah response jadi object JavaScript

### Langkah 3: Fungsi Fetch Forecast

```js
async function getForecast(city) {
  const url = `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Forecast tidak tersedia');
  }

  const data = await response.json();
  return data;
}
```

### Langkah 4: Fungsi Render Current Weather

Bikin fungsi yang nampilin data cuaca ke HTML:

```js
function renderCurrentWeather(data) {
  const cityName = document.getElementById('city-name');
  const date = document.getElementById('date');
  const temperature = document.getElementById('temperature');
  const description = document.getElementById('weather-description');
  const feelsLike = document.getElementById('feels-like');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const weatherIcon = document.getElementById('weather-icon');
  const currentWeatherSection = document.getElementById('current-weather');

  cityName.textContent = data.name;
  date.textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  currentWeatherSection.classList.remove('hidden');
}
```

**Penjelasan properti data dari API:**
| Properti | Arti | Contoh |
|----------|------|--------|
| `data.name` | Nama kota | "Jakarta" |
| `data.main.temp` | Suhu | 30.5 |
| `data.main.feels_like` | Suhu terasa | 33.2 |
| `data.main.humidity` | Kelembaban | 80 |
| `data.wind.speed` | Kecepatan angin (m/s) | 4.5 |
| `data.weather[0].description` | Deskripsi cuaca | "cerah berawan" |
| `data.weather[0].icon` | Kode icon | "02d" |
| `${data.weather[0].icon}@2x.png` | URL icon dari OpenWeatherMap | |

### Langkah 5: Fungsi Render Forecast

```js
function renderForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  const forecastSection = document.getElementById('forecast');

  forecastContainer.innerHTML = '';

  // Ambil data setiap 8 data point (24 jam / 3 jam = 8)
  // data.list[0] = hari ini, data.list[8] = besok, dst
  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
    const temp = Math.round(forecast.main.temp);
    const icon = forecast.weather[0].icon;
    const desc = forecast.weather[0].description;

    const card = document.createElement('div');
    card.className = 'forecast-card';

    card.innerHTML = `
      <p class="day">${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
      <p class="temp">${temp}°C</p>
    `;

    forecastContainer.appendChild(card);
  }

  forecastSection.classList.remove('hidden');
}
```

**Penjelasan:**
- `data.list` — array berisi 40 data point (3 jam × 8 = 24 jam × 5 hari = 40)
- `i += 8` — ambil data tiap 8 index (setiap 24 jam sekali ≈ jam yang sama tiap hari)
- `forecast.dt * 1000` — API ngasih timestamp detik, JavaScript pake milidetik
- `document.createElement('div')` — bikin elemen HTML baru pake JavaScript
- `card.className = 'forecast-card'` — kasih class CSS
- `innerHTML` — masukin isi HTML ke card

### Langkah 6: Fungsi Search City

Gabungin semua — fungsi utama yang dipanggil pas user search:

```js
async function searchCity(city) {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const errorMessage = document.getElementById('error-message');
  const currentWeatherSection = document.getElementById('current-weather');
  const forecastSection = document.getElementById('forecast');

  // Reset state (sembunyiin semua)
  error.classList.add('hidden');
  currentWeatherSection.classList.add('hidden');
  forecastSection.classList.add('hidden');

  // Tampilkan loading
  loading.classList.remove('hidden');

  try {
    // Ambil data cuaca dan forecast secara paralel
    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city),
    ]);

    // Render data ke UI
    renderCurrentWeather(currentData);
    renderForecast(forecastData);
  } catch (err) {
    // Tampilkan error
    errorMessage.textContent = err.message;
    error.classList.remove('hidden');
  } finally {
    // Sembunyiin loading (jalan terus, entah sukses atau error)
    loading.classList.add('hidden');
  }
}
```

**Penjelasan:**

| Konsep | Penjelasan |
|--------|-----------|
| `Promise.all([...])` | Jalanin dua fetch **bersamaan** (lebih cepat dari jalanin satu-satu) |
| `try` | Blok kode yang mungkin error |
| `catch (err)` | Tangkap error dan tampilkan pesannya |
| `finally` | Kode yang **pasti jalan** setelah try/catch — di sini buat nutup loading |

### Langkah 7: Event Listener (Search Form)

Pasang listener ke form search:

```js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const city = input.value.trim();

    if (city === '') {
      return; // Jangan lakuin apa-apa kalo input kosong
    }

    searchCity(city);
    input.value = ''; // Kosongin input setelah search
  });
});
```

**Penjelasan:**
- `DOMContentLoaded` — jalanin kode setelah HTML selesai di-load
- `event.preventDefault()` — cegah reload halaman (default behavior form submit)
- `input.value.trim()` — ambil teks input dan buang spasi di depan/belakang
- Kalo kosong, `return` (gak lakuin apa-apa)

## 7.4 Full Code `src/script.js`

Gabungin semua langkah di atas jadi satu file:

```js
const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.API_BASE_URL;

async function getCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Kota tidak ditemukan');
  }

  const data = await response.json();
  return data;
}

async function getForecast(city) {
  const url = `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Forecast tidak tersedia');
  }

  const data = await response.json();
  return data;
}

function renderCurrentWeather(data) {
  const cityName = document.getElementById('city-name');
  const date = document.getElementById('date');
  const temperature = document.getElementById('temperature');
  const description = document.getElementById('weather-description');
  const feelsLike = document.getElementById('feels-like');
  const humidity = document.getElementById('humidity');
  const windSpeed = document.getElementById('wind-speed');
  const weatherIcon = document.getElementById('weather-icon');
  const currentWeatherSection = document.getElementById('current-weather');

  cityName.textContent = data.name;
  date.textContent = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  description.textContent = data.weather[0].description;
  feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed} m/s`;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  currentWeatherSection.classList.remove('hidden');
}

function renderForecast(data) {
  const forecastContainer = document.getElementById('forecast-container');
  const forecastSection = document.getElementById('forecast');

  forecastContainer.innerHTML = '';

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
    const temp = Math.round(forecast.main.temp);
    const icon = forecast.weather[0].icon;
    const desc = forecast.weather[0].description;

    const card = document.createElement('div');
    card.className = 'forecast-card';

    card.innerHTML = `
      <p class="day">${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
      <p class="temp">${temp}°C</p>
    `;

    forecastContainer.appendChild(card);
  }

  forecastSection.classList.remove('hidden');
}

async function searchCity(city) {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  const errorMessage = document.getElementById('error-message');
  const currentWeatherSection = document.getElementById('current-weather');
  const forecastSection = document.getElementById('forecast');

  error.classList.add('hidden');
  currentWeatherSection.classList.add('hidden');
  forecastSection.classList.add('hidden');

  loading.classList.remove('hidden');

  try {
    const [currentData, forecastData] = await Promise.all([
      getCurrentWeather(city),
      getForecast(city),
    ]);

    renderCurrentWeather(currentData);
    renderForecast(forecastData);
  } catch (err) {
    errorMessage.textContent = err.message;
    error.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const city = input.value.trim();

    if (city === '') {
      return;
    }

    searchCity(city);
    input.value = '';
  });
});
```

---

# BAB 8 — Testing & Debugging

## 8.1 Cara Jalanin Aplikasi

### Mode Development (auto-reload)
```bash
npm run dev
```
- Buka `http://localhost:3000`
- Tiap kali kamu ganti file `src/`, browser auto-reload

### Mode Build (sekali)
```bash
npm run build
```
- Hasil di folder `dist/`
- Bisa buka `dist/index.html` langsung

## 8.2 Test Point per Langkah

### Test 1 — Build Sukses
Jalanin `npm run build`. Kalo gak ada error merah, sukses.

### Test 2 — Tampilan Awal
Buka aplikasi. Yang keliatan:
- Header "Weather App" warna biru
- Form search dengan input + tombol
- **Tidak ada** data cuaca (masih hidden)

### Test 3 — Search Kota Valid
Ketik "Jakarta" terus klik Cari.
- Loading spinner muncul sebentar
- Data cuaca Jakarta muncul
- 5 kartu forecast keliatan

### Test 4 — Search Kota Gak Valid
Ketik "asdfgh" terus klik Cari.
- Pesan error merah: "Kota tidak ditemukan"

### Test 5 — Tanpa Input
Langsung klik Cari tanpa ngetik apa-apa.
- Gak terjadi apa-apa (input ternyata `required`)

## 8.3 Debugging — Kalo Error

### Problem: "process is not defined"
**Penyebab:** Dotenv gak terkonfigurasi dengan benar.
**Solusi:**
- Pastiin `dotenv-webpack` udah di-install
- Pastiin `webpack.config.js` udah include `new Dotenv()`

### Problem: "Failed to load module script"
**Penyebab:** HTML di `dist/` bukan dari Webpack.
**Solusi:** Jangan manual bikin `dist/index.html` — biarin `HtmlWebpackPlugin` yang bikin.

### Problem: API Key not working
**Penyebab:** API Key belum aktif (butuh beberapa jam) atau salah.
**Solusi:**
- Cek langsung di browser: tempel URL API-nya
- Pastiin `.env` udah bener formatnya (`API_KEY=value` tanpa petik)

### Problem: Console error "Unexpected token <"
**Penyebab:** Response-nya HTML (404 page), bukan JSON. Biasanya URL salah.
**Solusi:** Cek URL endpoint di `script.js`.

## 8.4 Cara Debug Pake Browser DevTools

1. Buka aplikasi
2. **F12** atau **Klik Kanan → Inspect**
3. Tab **Console** — liat error JavaScript
4. Tab **Network** — liat request API (status 200? 404?)
5. Tab **Elements** — liat struktur HTML, cek class `hidden`

Di tab **Network**:
- Klik request ke `api.openweathermap.org`
- Liat **Response** tab — data JSON yang dikirim server
- Kalo response-nya `{"cod":401, "message":"Invalid API key"}` — API Key salah

---

# BAB 9 — Ringkasan Alur Aplikasi

Berikut gambaran **alur lengkap** dari user ngetik kota sampai data tampil:

```
┌──────────────────────────────────────────────────┐
│                 USER                             │
│   Ngetik "Jakarta" → Klik "Cari"                │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   Event listener (submit form)                  │
│   → ambil input.value                           │
│   → panggil searchCity("Jakarta")               │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   searchCity("Jakarta")                         │
│   → Tampilkan loading (.hidden dihapus)          │
│   → Sembunyiin error & data lama                │
│   → Promise.all([                               │
│       getCurrentWeather("Jakarta"),              │
│       getForecast("Jakarta"),                    │
│     ])                                          │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   getCurrentWeather("Jakarta")                  │
│   fetch(GET https://api.openweathermap.org/      │
│         data/2.5/weather?q=Jakarta&              │
│         units=metric&appid=API_KEY)             │
│                                                 │
│   ← Response JSON (current weather)             │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   getForecast("Jakarta")                        │
│   fetch(GET https://api.openweathermap.org/      │
│         data/2.5/forecast?q=Jakarta&             │
│         units=metric&appid=API_KEY)             │
│                                                 │
│   ← Response JSON (forecast)                    │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   renderCurrentWeather(data)                    │
│   → Isi textContent id="city-name"              │
│   → Isi textContent id="temperature"            │
│   → Isi src id="weather-icon"                   │
│   → Hapus class .hidden dari section            │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   renderForecast(data)                          │
│   → Loop data.list (setiap 8 index)             │
│   → Bikin div.forecast-card pake JS             │
│   → Append ke id="forecast-container"           │
│   → Hapus class .hidden dari section            │
└──────────┬───────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│   finally: Sembunyiin loading                   │
└──────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────┐
│                  USER                           │
│     Liat hasil: Jakarta 30°C, Cerah Berawan     │
│        5-day forecast di bawahnya               │
└──────────────────────────────────────────────────┘
```

Kalo error di salah satu fetch:
```
┌──────────────────────────────────────────────────┐
│   catch (err)                                   │
│   → isi id="error-message" dengan err.message   │
│   → hapus .hidden dari id="error"               │
│   → user liat pesan error merah                │
└──────────────────────────────────────────────────┘
```

---

# BAB 10 — Kesimpulan & Next Steps

## 10.1 Apa yang Sudah Kamu Pelajari?

| Konsep | Status |
|--------|--------|
| Node.js & npm | ✅ |
| Webpack setup (entry, output, loader, plugin) | ✅ |
| `dotenv-webpack` & `.env` | ✅ |
| Semantic HTML | ✅ |
| CSS layout (flexbox, grid, responsive) | ✅ |
| CSS animations (spinner) | ✅ |
| Fetch API (`async/await`) | ✅ |
| Error handling (`try/catch`) | ✅ |
| DOM manipulation | ✅ |
| Event listener | ✅ |
| `Promise.all` (parallel requests) | ✅ |

## 10.2 Fitur yang Bisa Kamu Kembangkan Sendiri

Setelah ini, coba tantang diri kamu dengan fitur tambahan:

1. **Geolocation** — pake `navigator.geolocation.getCurrentPosition()` buat auto-detect kota user
2. **Dark Mode** — toggle CSS variables (`:root`) antara tema terang dan gelap
3. **Unit Switch** — tombol ganti °C ↔ °F
4. **Local Storage** — simpan kota terakhir yang dicari, auto-load pas buka lagi
5. **Hourly Forecast** — tampilin forecast per 3 jam (bukan cuma per hari)
6. **Weather Background** — ganti background sesuai cuaca (cerah: kuning, hujan: biru gelap)
7. **Animasi Transisi** — pake CSS transition biar perpindahan data lebih halus

## 10.3 Deploy ke GitHub Pages

Panduan lengkap buat push ke GitHub dan deploy pake GitHub Pages ada di **BAB 11**.

---

## Kata Penutup

Selamat! Kamu udah berhasil bikin aplikasi weather lengkap dari nol. Ini bukan soal aplikasinya, tapi **pemahaman** yang kamu dapet:

- Cara kerja **API** (request → response)
- Cara pake **Fetch API** ambil data dari server
- Cara atur **konfigurasi rahasia** pake `.env`
- Cara atur **proyek modern** pake **Webpack**
- Cara tangani **error** dan **loading state**

**Ingat:** Semua programmer hebat belajar dari project kecil kayak gini. Terus eksplor, terus ngoding! 🚀

---

*— Mentor Odin Weather Project, 2026*

---

# BAB 11 — Push ke GitHub & Deploy ke GitHub Pages

## 11.1 Tujuan

Setelah aplikasi selesai, kamu pasti mau:
1. **Push ke GitHub** — nyimpen kode di cloud (biar aman, bisa diakses dari mana aja)
2. **Deploy ke GitHub Pages** — biar aplikasi bisa diakses online (public URL)

## 11.2 Prasyarat

Sebelum mulai, pastikan:
- Kamu udah punya **akun GitHub** (daftar di https://github.com)
- Git udah terinstall di komputermu

Cek Git:
```bash
git --version
```
Kalo muncul versi, berarti udah siap.

Kalo belum pernah pake Git sebelumnya, set identitas dulu:
```bash
git config --global user.name "Nama Kamu"
git config --global user.email "email@kamu.com"
```

## 11.3 Konsep: Git vs GitHub

**Git** — alat version control di lokal komputer. Nyimpen history perubahan kode.
**GitHub** — cloud service buat nyimpen repo Git biar bisa diakses online dan kolaborasi.

Alurnya:
```
Lokal (komputer kamu)           GitHub (cloud)
     │                              │
     │  git add .                    │
     │  git commit -m "pesan"        │
     │  git push origin main         │
     └─────────────────────────────► │
                                     │
     │  git pull                     │
     │◄───────────────────────────── │
```

## 11.4 Buat Repository di GitHub

**Langkah-langkah:**

1. Buka https://github.com
2. Login ke akun kamu
3. Klik tombol **"+"** di pojok kanan atas → **"New repository"**
4. Isi:
   - **Repository name:** `odin-weather` (sama kaya nama folder di lokal)
   - **Description:** (opsional) "Aplikasi Weather dengan Fetch API"
   - **Public** — biar bisa diakses semua orang
   - **Jangan centang** "Add a README", "Add .gitignore", atau "Add a license" — karena kita udah punya
5. Klik **"Create repository"**

Setelah jadi, kamu akan liat halaman dengan instruksi. Pilih bagian:

```
…or push an existing repository from the command line
```

Nanti ada 3 perintah:
```bash
git remote add origin https://github.com/username/odin-weather.git
git branch -M main
git push -u origin main
```

**Simpan perintah ini** — kita akan pake sebentar lagi.

## 11.5 Cara Kerja `.gitignore` Saat Push

Sebelum push, ingat file `.gitignore` kita sekarang:

```
node_modules
.env
dist
```

Artinya saat push ke GitHub:
- ✅ `src/index.html` — ke-push
- ✅ `src/style.css` — ke-push
- ✅ `src/script.js` — ke-push
- ✅ `webpack.config.js` — ke-push
- ✅ `package.json` — ke-push
- ✅ `.env.example` — ke-push (ini template, aman)
- ✅ `docs/manual.md` — ke-push
- ✅ `README.md` — ke-push
- ❌ `node_modules/` — **tidak** ke-push (terlalu berat)
- ❌ `.env` — **tidak** ke-push (API Key rahasia!)
- ❌ `dist/` — **tidak** ke-push (hasil build, bisa di-build ulang)

> **PENTING:** Cek lagi pake `git status` sebelum push buat pastiin `.env` gak ikut.

## 11.6 Push ke GitHub

Jalanin perintah-perintah ini satu per satu:

```bash
# Inisialisasi Git (kalo belum pernah)
git init

# Tambahin semua file yang mau di-commit
git add .

# Cek file apa aja yang bakal ke-commit
git status
```

Kalo ada file `.env` atau `node_modules` muncul di `git status`, **BERHENTI** — cek `.gitignore` dulu.

Kalo aman, lanjut:

```bash
# Commit dengan pesan
git commit -m "Inisialisasi proyek Weather App dengan Webpack"

# Tambahin remote GitHub (GANTI URL-nya punya kamu!)
git remote add origin https://github.com/username/odin-weather.git

# Rename branch jadi main
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Penjelasan tiap perintah:**

| Perintah | Penjelasan |
|----------|-----------|
| `git init` | Bikin repo Git baru di folder lokal |
| `git add .` | Stage semua file (kecuali yang di `.gitignore`) |
| `git status` | Lihat file apa aja yang siap di-commit |
| `git commit -m "..."` | Simpan perubahan dengan pesan |
| `git remote add origin URL` | Hubungkan repo lokal ke repo GitHub |
| `git branch -M main` | Ganti nama branch default jadi `main` |
| `git push -u origin main` | Upload kode ke GitHub (pertama kali pake `-u`) |

**Test Point:**
- Buka repo GitHub kamu di browser
- Refresh halaman
- Seharusnya semua file (kecuali `node_modules`, `.env`, `dist`) udah keliatan di GitHub

## 11.7 Deploy ke GitHub Pages

**GitHub Pages** adalah fitur gratis dari GitHub buat hosting website statis. Kita bisa pake buat nyajiin konten dari folder `dist/`.

Tapi karena `dist/` ada di `.gitignore` (gak ke-push), kita perlu cara khusus.

**Solusi:** Pake package `gh-pages` — otomatis build + push folder `dist/` ke branch `gh-pages` di GitHub.

### Langkah 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Langkah 2: Update `package.json`

Buka `package.json`, tambahin script baru:

```json
"scripts": {
  "build": "webpack",
  "dev": "webpack-dev-server",
  "watch": "webpack --watch",
  "deploy": "npm run build && gh-pages -d dist"
}
```

**Penjelasan:**
- `npm run build` — build dulu (bikin folder `dist/`)
- `&&` — jalanin perintah berikutnya kalo perintah sebelumnya sukses
- `gh-pages -d dist` — deploy isi folder `dist/` ke branch `gh-pages`

### Langkah 3: Deploy

```bash
npm run deploy
```

Proses yang terjadi:
1. Webpack build → folder `dist/` terisi
2. `gh-pages` bikin branch baru `gh-pages` di GitHub
3. Isi folder `dist/` di-copy ke branch `gh-pages`
4. Branch `gh-pages` di-push ke GitHub

**Test Point:**
Kalo sukses, terminal akan ngasih keluaran kayak gini:
```
Published
```
Atau:
```
Done. Your site is published at https://username.github.io/odin-weather/
```

### Langkah 4: Aktifkan GitHub Pages di Settings

Kalo pake `gh-pages`, kadang kita perlu setting GitHub Pages manual:

1. Buka repo GitHub kamu di browser
2. Klik tab **Settings** (paling kanan)
3. Di sidebar kiri, klik **Pages**
4. Di bagian **Branch**:
   - Pilih: `gh-pages`
   - Folder: `/ (root)`
   - Klik **Save**

Tunggu 1-2 menit. URL aplikasi kamu:
```
https://username.github.io/odin-weather/
```

> **Catatan:** Ganti `username` dengan username GitHub kamu yang asli.

## 11.8 Cara Update Aplikasi

Kalo kamu nambah fitur atau benerin bug, tinggal ulangin 3 langkah ini:

```bash
git add .
git commit -m "fix: perbaiki error saat search kota kosong"
git push origin main
npm run deploy
```

Atau biar lebih singkat:

```bash
git add . && git commit -m "update fitur" && git push && npm run deploy
```

**Penjelasan:**
- `git add .` — stage perubahan
- `git commit -m "..."` — simpan perubahan
- `git push` — push source code ke GitHub (biar kode aman)
- `npm run deploy` — deploy ulang ke GitHub Pages (biar URL online update)

## 11.9 Catatan Penting: API Key di GitHub Pages

**Ini PENTING banget:**

Di Bab 4 kita pake `.env` buat nyimpen API Key. Tapi ingat:
- `.env` gak di-push ke GitHub (aman)
- TAPI waktu Webpack build, nilai `process.env.API_KEY` diganti dengan API Key asli
- Jadi file `bundle.js` di folder `dist/` **berisi API Key kamu**
- `gh-pages` push folder `dist/` ke branch publik
- **API Key kamu jadi bocor!**

### Solusi Sementara (buat belajar):

Buat keperluan belajar, API Key gratis OpenWeatherMap gak terlalu beresiko. Tapi tetep:

1. Jangan share URL GitHub Pages kamu ke publik kalo belum paham risikonya
2. Kalo mau aman, bikin **server-side proxy** (topik lanjutan)

### Solusi Profesional (Server-Side Proxy):

Bikin backend kecil (pake Node.js misalnya) yang nerima request dari frontend, trus backend yang panggil API OpenWeatherMap. API Key cuma ada di server.

```
Browser (Frontend)     →     Server (Backend)     →     OpenWeatherMap API
     │                            │                           │
     │  GET /weather/Jakarta      │                           │
     ├───────────────────────────►│                           │
     │                            │  GET /data/2.5/weather    │
     │                            │  ?q=Jakarta&appid=KEY     │
     │                            ├──────────────────────────►│
     │                            │                           │
     │                            │  Response JSON            │
     │                            │◄──────────────────────────│
     │  Response JSON             │                           │
     │◄───────────────────────────┤                           │
```

Ini bisa kamu pelajari setelah kamu paham backend programming.

## 11.10 Troubleshooting GitHub

### Problem: Push ditolak "failed to push some refs"

**Penyebab:** Remote GitHub punya file yang gak ada di lokal (misal README auto-generated).
**Solusi:**
```bash
git pull origin main --rebase
git push origin main
```

### Problem: "src refspec main does not match any"

**Penyebab:** Belum ada commit.
**Solusi:**
```bash
git add .
git commit -m "first commit"
git push origin main
```

### Problem: "fatal: remote origin already exists"

**Penyebab:** Udah pernah tambah remote sebelumnya.
**Solusi:** Ganti aja:
```bash
git remote set-url origin https://github.com/username/odin-weather.git
```

### Problem: GitHub Pages cuma muncul halaman README

**Penyebab:** Settings Pages belum diatur ke branch `gh-pages`.
**Solusi:** Ikuti **Langkah 4** di 11.7.

### Problem: `gh-pages` error "Permission denied"

**Penyebab:** Kamu belum login ke GitHub dari terminal.
**Solusi:**
```bash
gh auth login
```
Atau pake token:
1. Buka GitHub → Settings → Developer settings → Personal access tokens
2. Generate token baru (centang `repo`)
3. Copy token, simpan di tempat aman
4. Kalo diminta password pas push, pake token ini

## 11.11 Ringkasan Perintah

| Kapan | Perintah |
|-------|----------|
| Pertama kali push | `git add . && git commit -m "init" && git branch -M main && git push -u origin main` |
| Update kode aja | `git add . && git commit -m "pesan" && git push` |
| Build + deploy | `npm run deploy` |
| Semua sekaligus | `git add . && git commit -m "pesan" && git push && npm run deploy` |

## 11.12 Cek Hasil Deploy

1. Buka: `https://username.github.io/odin-weather/`
2. Aplikasi weather kamu harusnya udah hidup online!
3. Test search kota "Jakarta" — apakah berfungsi?
4. Cek di browser DevTools (F12) → tab **Network** — apakah fetch ke OpenWeatherMap sukses?

**Selamat! Aplikasi kamu sekarang udah online dan bisa diakses dari mana aja!** 🎉

---
