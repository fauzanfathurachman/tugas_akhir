# Sistem Pendaftaran Online MTs Ulul Albab

Sistem pendaftaran online yang komprehensif untuk calon siswa MTs Ulul Albab dengan fitur form wizard multi-step, validasi data real-time, upload berkas digital, sistem tracking nomor pendaftaran, dan notifikasi email/SMS otomatis.

## 🚀 Fitur Utama

### Untuk Calon Siswa
- **Form Wizard Multi-Step**: Proses pendaftaran yang terstruktur dan mudah dipahami
- **Validasi Real-time**: Validasi data secara langsung saat pengisian
- **Upload Dokumen Digital**: Upload berkas persyaratan (ijazah, foto, kartu keluarga, dll)
- **Tracking Status**: Pantau status pendaftaran dengan nomor pendaftaran unik
- **QR Code**: QR code untuk tracking cepat
- **Notifikasi Otomatis**: Email dan SMS konfirmasi pendaftaran

### Untuk Admin
- **Dashboard Analytics**: Statistik pendaftaran real-time
- **Manajemen Pendaftaran**: Review dan approval pendaftaran
- **Export Data**: Export data ke CSV/Excel
- **Sistem Notifikasi**: Kirim reminder dan update status
- **Multi-level Admin**: Role-based access control

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** dengan Express.js
- **MongoDB** dengan Mongoose ODM
- **JWT** untuk autentikasi
- **Multer** untuk file upload
- **Nodemailer** untuk email notifications
- **Twilio** untuk SMS notifications
- **QRCode** untuk generate QR codes

### Frontend
- **React.js** dengan hooks dan context
- **React Router** untuk routing
- **Tailwind CSS** untuk styling
- **Formik & Yup** untuk form handling dan validasi
- **React Dropzone** untuk file upload
- **React Hot Toast** untuk notifications
- **Lucide React** untuk icons
- **Framer Motion** untuk animations

## 📋 Persyaratan Sistem

- Node.js (v16 atau lebih baru)
- MongoDB (v4.4 atau lebih baru)
- npm atau yarn

## 🚀 Instalasi dan Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd mts-ulul-albab-registration
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Setup Environment Variables
```bash
# Copy environment example
cp env.example .env

# Edit .env file dengan konfigurasi yang sesuai
```

### 4. Konfigurasi Database
Pastikan MongoDB sudah berjalan dan update `MONGODB_URI` di file `.env`

### 5. Setup Email (Opsional)
Untuk fitur notifikasi email, konfigurasi SMTP di `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 6. Setup SMS (Opsional)
Untuk fitur notifikasi SMS, konfigurasi Twilio di `.env`:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### 7. Jalankan Aplikasi
```bash
# Development mode (backend + frontend)
npm run dev

# Atau jalankan terpisah:
# Backend
npm run server

# Frontend
npm run client
```

## 📁 Struktur Proyek

```
mts-ulul-albab-registration/
├── server/                 # Backend Node.js
│   ├── config/            # Konfigurasi database
│   ├── middleware/        # Middleware (auth, upload)
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic (email, SMS)
│   └── index.js          # Server entry point
├── client/               # Frontend React
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── index.js      # React entry point
│   └── package.json
├── uploads/              # Uploaded files
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Registration
- `POST /api/registration/personal-data` - Create new registration
- `PUT /api/registration/:id/parent-data` - Update parent data
- `PUT /api/registration/:id/academic-data` - Update academic data
- `POST /api/registration/:id/documents` - Upload documents
- `POST /api/registration/:id/submit` - Submit registration
- `GET /api/registration/:id` - Get registration details

### Admin
- `GET /api/admin/registrations` - Get all registrations
- `GET /api/admin/registrations/:id` - Get registration by ID
- `PUT /api/admin/registrations/:id/status` - Update status
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/export/registrations` - Export data

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get admin profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

## 🎨 Fitur UI/UX

### Design System
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean dan professional design
- **Accessibility**: WCAG compliant
- **Loading States**: Skeleton loading dan spinners
- **Error Handling**: User-friendly error messages

### User Experience
- **Progressive Disclosure**: Informasi ditampilkan secara bertahap
- **Form Validation**: Real-time validation dengan feedback
- **Auto-save**: Data tersimpan otomatis
- **Progress Indicator**: Visual progress untuk multi-step form
- **Success Feedback**: Konfirmasi untuk setiap aksi

## 🔒 Keamanan

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt untuk enkripsi password
- **Input Validation**: Server-side validation
- **File Upload Security**: Validasi file type dan size
- **Rate Limiting**: Mencegah abuse
- **CORS Protection**: Cross-origin resource sharing
- **Helmet**: Security headers

## 📊 Monitoring dan Analytics

- **Registration Analytics**: Statistik pendaftaran
- **User Activity**: Tracking user behavior
- **Performance Monitoring**: Response time monitoring
- **Error Logging**: Comprehensive error tracking

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
NODE_ENV=production npm start
```

### Environment Variables untuk Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-secure-jwt-secret
```

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Kontak

- **Email**: info@mtsululalbab.sch.id
- **Phone**: (021) 1234-5678
- **Website**: https://mtsululalbab.sch.id

## 🙏 Ucapan Terima Kasih

Terima kasih kepada semua pihak yang telah berkontribusi dalam pengembangan sistem ini.

---

**MTs Ulul Albab** - Mengembangkan Generasi Unggul dengan Pendidikan Berkualitas