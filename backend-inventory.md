# Backend Discovery & Inventory Report

## 1. Technology Stack Discovery
- **Language**: JavaScript (ES6+ / Node.js)
- **Framework**: Express.js (v5.2.1)
- **Runtime**: Node.js v20.x LTS
- **Package Manager**: npm
- **Database ORM/ODM**: Mongoose ODM (v9.6.2) / MongoDB

## 2. System Architecture
- **Pattern**: Layered Controller-Route Architecture with Express Router
- **Decoupling**: Decoupled RESTful API endpoints serving React web client & Appium mobile automation clients
- **Authentication**: JWT (`jsonwebtoken` v9.0.3) with HTTP Bearer authorization headers
- **Password Security**: `bcryptjs` (v3.0.3) adaptive salted hashing

## 3. API Structural Overview
- **Protocol**: RESTful JSON HTTP Web Services
- **CORS Configuration**: Enabled (`cors` middleware)
- **Environment Management**: `dotenv` (v17.4.2)

## 4. Discovered Backend Modules & Entities
- `/api/auth`: User authentication, login, token generation, user roles
- `/api/menu`: Temple prasadam / item catalog management, category filtering
- `/api/orders`: Order placement, status tracking (PENDING, COMPLETED, CANCELLED)
- `/api/dashboard`: Metrics aggregation, daily revenue, active visitor counters
