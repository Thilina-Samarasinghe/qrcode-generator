# 🎫 Secure QR Code Event Ticket System

A full-stack, production-ready QR code generation and verification system. This application allows users to create event tickets as secure QR codes and verify them using a built-in scanner with server-side HMAC validation.

## 🚀 Features

- **Dynamic QR Generation**: Generate high-quality QR codes for any event with custom details.
- **HMAC Security**: Every QR code is digitally signed on the backend using SHA-256 HMAC to prevent forgery and tampering.
- **Real-time Scanning**: Integrated browser-based camera scanner for quick ticket validation.
- **Server-Side Verification**: Scanned tickets are verified against the server's secret key to ensure authenticity.
- **Responsive Design**: Modern, mobile-friendly UI built with Next.js and Tailwind CSS.
- **Database Persistence**: Event and ticket data managed with Prisma and PostgreSQL (Neon).

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon DB)
- **Security**: Node.js `crypto` (HMAC-SHA256)
- **QR Engine**: `qrcode` package

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Scanning Engine**: `jsQR` (Client-side decoding)

---

## 📂 File Structure

```text
qr-generator/
├── backend/                # NestJS API
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── event/          # Event controller, service, and DTOs
│   │   ├── qr/             # QR generation and HMAC logic
│   │   └── prisma/         # Prisma service integration
│   └── .env                # Environment variables (Database URL, Secret Key)
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # App router (Events, Scan, etc.)
│   │   ├── components/     # Reusable UI components
│   │   └── styles/         # Global styles and Tailwind config
│   └── .env.local          # API URL configuration
└── README.md
```

---

## 🔌 API Endpoints

### Events
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/events` | Retrieve all created events |
| `POST` | `/events` | Create a new event and generate a signed QR code |
| `GET` | `/events/:id` | Get details for a specific event |
| `DELETE` | `/events/:id` | Delete an event |

### Security/Verification
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/events/verify` | Validates a scanned QR payload against the server HMAC secret |

---

## 🛡️ Security Implementation (HMAC)

Unlike standard QR generators that store plain text, this system ensures data integrity:
1. **Signing**: When an event is created, the server stringifies the data and creates a unique signature using a `QR_SECRET`.
2. **Encoding**: The signature is embedded inside the QR code JSON.
3. **Verification**: Upon scanning, the server re-calculates the signature. If a user tries to modify the ticket data (e.g., changing the price or event name), the verification will fail.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL Database (or Neon DB account)

### 2. Backend Setup
```bash
cd backend
npm install
# Configure .env with DATABASE_URL and QR_SECRET
npx prisma generate
npx prisma db push
npm run start:dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Configure .env.local with NEXT_PUBLIC_API_URL
npm run dev
```

---

## 📝 License
Distributed under the MIT License.

---
**GitHub Repository**: [qrcode-generator](https://github.com/Thilina-Samarasinghe/qrcode-generator.git)
