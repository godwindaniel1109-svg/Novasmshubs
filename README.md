# NovaSMSHubs - Virtual Phone Number Service

A complete virtual phone number service with separate frontend, backend, and admin dashboard for easy deployment.

## 📁 Project Structure

```
NovaSMSHubs/
├── frontend/           # Main React frontend for users
├── backend/            # Node.js/Express API for users
├── admin-frontend/     # React admin dashboard
├── admin-backend/       # Node.js/Express API for admin
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### 1. Setup Main Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

### 2. Setup Admin Backend
```bash
cd admin-backend
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run dev
```

### 3. Setup Main Frontend
```bash
cd frontend
cp .env.production .env.local
npm install
npm start
```

### 4. Setup Admin Frontend
```bash
cd admin-frontend
cp .env.production .env.local
npm install
npm start
```

## 🌐 Access Points

- **Main Application**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Main API**: http://localhost:5000
- **Admin API**: http://localhost:5001

## 🔐 Default Admin Credentials

- **Email**: admin@novasmshubs.com
- **Password**: admin123

## 📱 Features

### Main Application
- ✅ User registration and login
- ✅ Virtual phone number purchasing
- ✅ Wallet management with Paystack integration
- ✅ Order history and tracking
- ✅ Profile management with image upload
- ✅ Mobile-responsive design
- ✅ Real-time notifications

### Admin Dashboard
- ✅ User management (view, activate, suspend, delete)
- ✅ Transaction approval/rejection
- ✅ Bulk notifications (individual & all users)
- ✅ Statistics and analytics
- ✅ Admin profile management
- ✅ Mobile-responsive design
- ✅ Secure authentication

## 🛠 Technologies Used

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Lucide React Icons
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

### Integrations
- Paystack Payment Gateway
- 5Sim API for virtual numbers
- Google OAuth

## 📦 Deployment

### Production Deployment

1. **Setup Environment Variables**
   ```bash
   # Backend
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=novasmshubs
   
   # Frontend
   REACT_APP_API_URL=https://api.yourdomain.com/api
   REACT_APP_PAYSTACK_PUBLIC_KEY=your_paystack_key
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   npm install --production
   npm start
   ```

3. **Deploy Admin Backend**
   ```bash
   cd admin-backend
   npm install --production
   npm start
   ```

4. **Deploy Frontend**
   ```bash
   cd frontend
   npm run build
   # Deploy build/ folder to your web server
   ```

5. **Deploy Admin Frontend**
   ```bash
   cd admin-frontend
   npm run build
   # Deploy build/ folder to your admin web server
   ```

## 🔧 Configuration

### Database Setup
```sql
CREATE DATABASE novasmshubs;
-- Tables are created automatically by the backend
```

### Environment Variables

#### Main Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=novasmshubs
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET_KEY=your_paystack_secret
PORT=5000
```

#### Admin Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=novasmshubs
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@novasmshubs.com
ADMIN_PASSWORD=admin123
ADMIN_PORT=5001
```

## 📊 API Endpoints

### Main API (Port 5000)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `POST /api/paystack/verify/:reference` - Verify Paystack payment
- `GET /api/orders` - Get user orders

### Admin API (Port 5001)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/transactions` - List transactions
- `PUT /api/admin/transactions/:id/approve` - Approve transaction
- `PUT /api/admin/transactions/:id/reject` - Reject transaction
- `GET /api/admin/notifications` - List notifications
- `POST /api/admin/notifications` - Send notification
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile

## 🎨 Mobile Responsiveness

All components are fully responsive and work seamlessly on:
- 📱 Mobile phones (320px+)
- 📟 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection
- Helmet.js security headers
- File upload restrictions

## 🆘 Support

For support:
- 📞 Call: 07048694977
- 💬 Telegram: @Primesmshub

## 📄 License

MIT License - see LICENSE file for details

---

**NovaSMSHubs** - Your trusted virtual phone number service provider 🚀
