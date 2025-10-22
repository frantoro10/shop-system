# 🏪 Big Bull Shop System

> A professional, production-ready inventory and sales management system built with React and Firebase.

---

## 🚀 Tech Stack

- ⚛️ **React 19** + **Vite** - Modern and fast development environment
- 🔥 **Firebase** - Backend as a Service (BaaS)
  - Firestore Database - Real-time NoSQL database
  - Authentication - Secure email/password authentication
- 🎨 **SCSS Modules** - Component-scoped styling with advanced CSS features
- 🎯 **Bootstrap** - Responsive grid system and utilities
- 🔒 **React Router** - Client-side routing with protected routes
- 📦 **Context API** - Centralized state management

---

## 🎯 Project Overview

Big Bull Shop System is a **real-world inventory management application** designed for small to medium retail businesses. It provides a comprehensive solution for managing products, tracking prices and costs, and controlling access through role-based authentication.

The system features a **public-facing product catalog** for customers while restricting administrative functions (CRUD operations) to authenticated users, making it ideal for businesses that want to showcase their inventory online while maintaining secure backend control.

---

## ✨ Key Features

### � **Authentication System**
- Secure email/password login using Firebase Authentication
- Protected routes for administrative functions
- Session persistence across browser refreshes
- Clean logout functionality with automatic redirect

### 📦 **Product Management (CRUD)**
- **Create**: Add new products with name, price, cost, category, and image
- **Read**: Display all products in a responsive grid layout
- **Update**: Modify product prices and costs in real-time
- **Delete**: Remove products from inventory with confirmation
- Real-time synchronization with Firestore database

### 🛡️ **Role-Based Access Control**
- **Public Users**: Can view product catalog and prices
- **Authenticated Admins**: Full CRUD access to inventory
- Cost prices hidden from public view (admin-only information)
- Conditional rendering based on authentication state

### 🧮 **Smart Calculator**
- Dynamic shopping cart functionality
- Real-time total calculation based on quantity
- Quick add/remove items interface
- Visual feedback for cart changes

### 🔍 **Advanced Filtering System**
- **Category Filters**: Kiosco, Almacen, Bebidas, Lacteos, Farmacia
- **Search Bar**: Real-time product search by name
- Custom-styled checkboxes with smooth animations
- Responsive filter layout (vertical on desktop, horizontal on mobile)

### 📊 **Real-Time Data Synchronization**
- Instant updates across all connected clients
- Optimistic UI updates for better user experience
- Automatic data refresh after CRUD operations

### 🎨 **Modern UI/UX Design**
- Fully responsive design (mobile-first approach)
- Gradient color schemes with consistent branding
- Smooth animations and hover effects
- Professional typography and spacing
- Custom-styled form controls

---

## 🏗️ Architecture & Best Practices

### **Service Layer Pattern**
Clean separation of concerns with dedicated service modules:
- `services/auth.js` - Authentication operations
- `services/products.js` - Product CRUD operations
- Centralized Firebase configuration in `config/firebase.js`

### **Context API for State Management**
- `ProductsContext` - Global product state and filter logic
- `AuthContext` - User authentication state and methods
- `CountContext` - Shopping cart state management

### **Environment Variables**
- Secure API key management using `.env` file
- Vite environment variable system (`VITE_` prefix)
- No sensitive credentials exposed in codebase

### **Component Modularity**
- SCSS Modules for scoped styling
- Reusable components (Count, FiltersMenu, SearchBar)
- Clear component hierarchy and prop drilling management

---

## 🔥 Firebase Integration

### **Firestore Database**
- Collection: `products`
- Real-time data synchronization
- Efficient querying with compound indexes
- Scalable NoSQL document structure

### **Firebase Authentication**
- Email/password provider
- Secure session management
- Authentication state observer pattern
- Token-based API protection

### **Security Rules**
- Public read access for product catalog
- Authenticated write access for CRUD operations
- User-based data isolation
- XSS and injection protection

---

## � Responsive Design

The application is fully responsive across all devices:
- **Mobile** (< 768px): Stacked layout, touch-optimized controls
- **Tablet** (769px - 1024px): Balanced grid, hybrid navigation
- **Desktop** (> 1024px): Full-width grid, enhanced features

---

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/frantoro10/shop-system.git
cd shop-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

---

## � Project Structure

```
shop-system/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Calculator/
│   │   ├── Count/
│   │   ├── Filters/
│   │   ├── ItemListContainer/
│   │   ├── Login/
│   │   ├── ProductForm/
│   │   └── ProtectedRoute/
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CountContext.jsx
│   │   └── ProductsContext.jsx
│   ├── services/          # Firebase service layer
│   │   ├── auth.js
│   │   └── products.js
│   ├── config/            # Configuration files
│   │   └── firebase.js
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route components
│   └── utils/             # Utility functions
├── public/                # Static assets
└── .env                   # Environment variables
```

---

## 🔒 Security Features

- Environment variable protection for API keys
- Firebase Security Rules for database access control
- Protected routes with authentication middleware
- Input validation and sanitization
- XSS protection through React's built-in escaping

---

## 🎯 Use Cases

This system is designed for:
- **Retail Stores**: Manage inventory and showcase products
- **Convenience Stores**: Quick price updates and category management
- **Kiosks**: Simple product catalog with admin backend
- **Small Businesses**: Cost-effective inventory management solution

---

## 📈 Future Enhancements

- Multi-user roles (admin, manager, viewer)
- Sales analytics and reporting dashboard
- Barcode scanning integration
- Invoice generation
- Stock level alerts
- Order management system

---

## 👨‍💻 Developer

**Francisco Toro**  
GitHub: [@frantoro10](https://github.com/frantoro10)

---

## 📄 License

This project is developed for production use and demonstrates professional React and Firebase development practices.

---

## 📌 Notes

- 🗂️ The version uploaded to GitHub is a **replica** of the original project.
- 🔐 The connected **database is not the production version**.
- 🔧 This project is **scalable**, and back-end functionalities (such as user authentication or order management) can be added upon client request.

---

## 🔗 Live Demo

🌐 [mini-business.vercel.app](https://mini-business.vercel.app/)

---
