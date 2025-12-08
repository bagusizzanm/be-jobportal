# Backend Job Portal

BeJobPortal adalah sebuah aplikasi web yang dibuat untuk mempertemukan antara pencari kerja dan perusahaan. Aplikasi ini dibuat menggunakan Express.js sebagai framework backend dan MongoDB sebagai database. Aplikasi ini juga menggunakan JWT (JSON Web Token) untuk melakukan autentikasi dan authorisasi.

# 🚀 Fitur Utama

- ✅ Autentikasi dan Authorisasi menggunakan JWT.
- 📊 DB menggunakan MonggoDB cloud.
- 🔐 Middleware kustom seperti upload image file.

# 📂 Struktur Project

```.
└── bejobportal/
    ├── config
    ├── controller/
    │   ├── analyticsController
    │   ├── appController
    │   ├── authController
    │   ├── jobController
    │   ├── savedJobController
    │   └── userController
    ├── middleware/
    │   ├── authMiddleware
    │   └── uploadMiddleware
    ├── models/
    │   ├── Analytics
    │   ├── Application
    │   ├── Job
    │   ├── SavedJob
    │   └── User
    ├── routes/
    │   ├── analyticsRoutes
    │   ├── appRoutes
    │   ├── authRoutes
    │   ├── jobRoutes
    │   ├── savedRoutes
    │   └── userRoutes
    └── server.js
```

# ⚙️ Instalasi Project

```
1. Download source kode : https://github.com/bagusizzanm/be-jobportal
2. cd be-jobportal
3. npm install
4. node server.js
```
