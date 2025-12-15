# 🏥 Doctor Appointment Booking – Full Stack Application

A **complete full‑stack doctor appointment & consultation platform** where patients can book appointments with doctors, make secure payments, and attend **one‑to‑one video consultations**. The system supports **role‑based access**, modern dashboards, and a scalable backend architecture.

---

## 🚀 Live Demo

🔗 [View Live](https://appointment-booking-plum.vercel.app)

---

## 📸 Screenshots

| Home Page                         | Community Project                   |  Website Generation                      |
|----------------------------------|----------------------------------|-----------------------------------|
| ![Home](https://github.com/YashRana52/Ai-Website-Builder/blob/main/Screenshot%202025-12-15%20121955.png?raw=true) | ![Community](https://github.com/YashRana52/Ai-Website-Builder/blob/main/Screenshot%202025-12-15%20122106.png?raw=true) | ![Website](https://github.com/YashRana52/Ai-Website-Builder/blob/main/Screenshot%202025-12-15%20122141.png?raw=true) |

---

## 🚀 Project Overview

This project demonstrates how to build a **real‑world healthcare booking system** with:

* Patient & Doctor onboarding
* Appointment booking & management
* Razorpay payment integration
* One‑to‑one video consultations using **ZEGOCLOUD SDK**
* Modern, responsive UI
* Clean and scalable backend APIs

---

## ✨ Frontend Features

### 👤 User Onboarding Flow

* Separate registration for **Patients** and **Doctors**
* Secure login system
* Role‑based UI rendering

---

### 🔐 Login & Role‑Based Access

* Patient access → Book & manage appointments
* Doctor access → Manage schedules & consultations
* Admin role planned for future extension

---

### 🩺 Doctor List & Profile Display

* List of available doctors
* Doctor profile includes:

  * Specialization
  * Experience
  * Availability
  * Consultation fee

---

### 📅 Appointment Booking Flow

* Select doctor
* Choose available time slot
* Confirm booking
* Proceed to payment

---

### 💳 Payment Integration (Razorpay)

* Secure online payments
* Payment verification from backend
* Appointment confirmed only after successful payment

---

### 🎥 One‑to‑One Video Consultation

* Real‑time video call using **ZEGOCLOUD SDK**
* Secure doctor‑patient private consultation
* Session‑based access

---

### 📊 Dashboards

#### 👨‍⚕️ Doctor Dashboard

* View upcoming appointments
* Manage availability & schedules
* Update profile information

#### 🧑‍💻 Patient Dashboard

* View booked appointments
* Appointment history
* Join video consultations

---

### 🎨 Modern & Responsive UI

* Built with **React + Tailwind CSS**
* Mobile‑first responsive design
* Clean, modern healthcare UI

---

### ⚡ State Management

* **Zustand** for global state
* Lightweight & scalable
* Handles auth state, appointments & payments

---

## 🔹 Backend Features

### 🔐 Authentication & Authorization

* JWT‑based authentication
* Secure session handling
* Role‑based authorization:

  * Patient
  * Doctor
  * Admin (future)

---

### 📦 Database Models

* User (Patient / Doctor)
* Appointment / Consultation
* Payments

---

### 📅 Appointment APIs

* Book appointment
* Update appointment status
* Fetch doctor‑wise & patient‑wise appointments

---

### 💳 Razorpay Payment APIs

* Create payment order
* Verify payment signature
* Store payment details

---

### 🔗 Doctor–Patient Relationship Management

* One‑to‑many relationship handling
* Secure access to consultation data

---

### 🧾 Custom Response Handlers

* Unified success response format
* Consistent error handling
* Clean API responses for frontend

---

## 🧠 System Architecture

```text
Frontend (React + Tailwind)
   │
   │ REST APIs
   ▼
Backend (Node + Express)
   │
   │ ORM / DB Queries
   ▼
Database (MongoDB / PostgreSQL)
```

---

## 🧰 Tech Stack

### 💻 Frontend

* React.js
* Tailwind CSS
* Zustand
* ZEGOCLOUD SDK

### 🖥️ Backend

* Node.js
* Express.js
* JWT Authentication
* Razorpay API

---

## ⚙️ Environment Variables

```env
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
ZEGOCLOUD_APP_ID=your_app_id
ZEGOCLOUD_SERVER_SECRET=your_secret
```

---

## 🚀 Complete Full‑Stack Flow

1. User registers as Patient or Doctor
2. Login with role‑based access
3. Patient selects doctor & books appointment
4. Razorpay payment is completed
5. Backend verifies payment
6. Appointment is confirmed
7. Doctor & patient join video consultation

---

## 🏆 Best Practices Used

* Role‑based access control
* Secure payment verification
* Clean API structure
* Scalable state management
* Modular frontend architecture
* Production‑ready backend design

---

## 📌 Ideal For

* Healthcare booking platforms
* Full‑stack developers
* Real‑world SaaS projects
* Portfolio & production‑grade apps

---

## 👨‍💻 Author

**Yash Rana**
🎓 IET Lucknow
📧 [yashrana2200520100072@gmail.com](mailto:yashrana2200520100072@gmail.com)
🔗 LinkedIn: [https://www.linkedin.com/in/yashrana52](https://www.linkedin.com/in/yashrana52)
💻 GitHub: [https://github.com/YashRana52](https://github.com/YashRana52)

---

⭐ Star the repository if you find this project helpful!
