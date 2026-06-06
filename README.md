# Medifind-
Prescription-based medicine finder web app
💊 MediFind

Scan your prescription. Find your medicines. Go directly.

MediFind is a full stack web application that helps patients find nearby pharmacies that have all their prescribed medicines in stock — saving time and eliminating the frustration of visiting multiple medical shops.

🚀 The Problem
When a doctor gives you a prescription, you often have to visit 4–5 pharmacies before finding one that has all your medicines in stock. This is especially painful during late nights or medical emergencies.
✅ The Solution
MediFind lets you:

Upload your prescription photo
AI automatically reads and extracts medicine names (OCR)
App searches all nearby pharmacies in real time
Shows which pharmacy has ALL your medicines in stock
Get directions directly to that pharmacy


🛠️ Tech Stack

LayerTechnology BackendJava 21 + Spring Boot 3.4FrontendReact.js + Tailwind CSSDatabaseMySQLOCRTesseract Java LibraryMapsLeaflet.js + OpenStreetMapAuthSpring Security + JWT

✨ Features

📄 Prescription upload with AI-powered OCR
🏥 Nearby pharmacy search with real-time stock matching
🟢 Color-coded availability (Green = full stock, Yellow = partial, Red = none)
🗺️ Interactive map view with pharmacy pins
🔐 Separate login for Users and Pharmacy Owners
📦 Pharmacy dashboard to manage medicine inventory
📱 Fully responsive — works on mobile browsers


📁 Project Structure
medifind/
├── backend/        → Spring Boot REST API
├── frontend/       → React.js web app
└── docs/           → Screenshots and documentation

🗄️ Database Design
users           → patient accounts
pharmacies      → registered pharmacy shops
medicines       → stock inventory per pharmacy
prescriptions   → uploaded prescriptions and extracted medicines
search_history  → user search logs

🚦 Getting Started
Prerequisites

Java 21
Node.js 20+
MySQL 8+
Maven

Backend Setup
bashcd backend
# Configure MySQL in src/main/resources/application.properties
mvn spring-boot:run
Frontend Setup
bashcd frontend
npm install
npm start

📸 Screenshots

Coming soon as the project progresses.


👩‍💻 Developer
Sai Pooja
Third Year Computer Science Student
Panimalar Engineering College, Chennai

