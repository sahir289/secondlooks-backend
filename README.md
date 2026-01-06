# SecondLooks Backend API

Production-ready backend API for the SecondLooks e-commerce platform built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Refresh token mechanism
  - Password hashing with bcrypt
  - Role-based access control (User, Admin)

- **Product Management**
  - Product listing with filtering, search, and pagination
  - Category management
  - Product reviews and ratings
  - Featured products

- **Security**
  - Helmet.js for security headers
  - Rate limiting
  - CORS configuration
  - Input validation and sanitization

- **Error Handling**
  - Centralized error handling
  - Custom error classes
  - Detailed error logging

- **Logging**
  - Winston logger
  - Request logging with Morgan
  - File-based logs

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd secondlooks-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/secondlooks"
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   # You can open Prisma Studio to add data manually
   npm run prisma:studio
   ```

## 🏃 Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
# Build the project
npm run build

# Start the server
npm start
```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register a new user
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CUSTOMER"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Profile (Protected)
```http
GET /api/v1/auth/profile
Authorization: Bearer <access-token>
```

#### Update Profile (Protected)
```http
PUT /api/v1/auth/profile
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

#### Logout
```http
POST /api/v1/auth/logout
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Product Endpoints

#### Get all products
```http
GET /api/v1/products?page=1&limit=20&search=shirt&categoryId=uuid&minPrice=10&maxPrice=100&sortBy=price&sortOrder=asc
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search in name, description, brand
- `categoryId` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `isFeatured` (optional): Filter featured products
- `sortBy` (optional): Sort field (name, price, createdAt)
- `sortOrder` (optional): asc or desc

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "salePrice": 79.99,
      "category": {
        "id": "uuid",
        "name": "Category Name",
        "slug": "category-slug"
      },
      "brand": "Brand Name",
      "sku": "PROD-001",
      "stock": 50,
      "images": ["url1", "url2"],
      "averageRating": 4.5,
      "reviewCount": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Get product by ID
```http
GET /api/v1/products/:id
```

#### Get product by SKU/Slug
```http
GET /api/v1/products/slug/:slug
```

#### Get featured products
```http
GET /api/v1/products/featured?limit=10
```

#### Get all categories
```http
GET /api/v1/products/categories/all
```

#### Get category by slug
```http
GET /api/v1/products/categories/:slug
```

### Health Check
```http
GET /api/v1/health
```

## 🗂️ Project Structure

```
secondlooks-backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── index.ts          # Configuration
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── product.controller.ts
│   ├── db/
│   │   └── prisma.ts         # Prisma client
│   ├── middleware/
│   │   ├── auth.ts           # Authentication middleware
│   │   ├── errorHandler.ts  # Error handling
│   │   └── validator.ts     # Validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── product.service.ts
│   ├── utils/
│   │   ├── errors.ts         # Custom error classes
│   │   └── logger.ts         # Winston logger
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   └── product.validator.ts
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── logs/                     # Log files
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents brute-force attacks
- **Input Validation**: Express-validator for request validation
- **Password Hashing**: Bcrypt with salt rounds
- **JWT**: Secure token-based authentication
- **CORS**: Configurable CORS policy
- **SQL Injection Prevention**: Prisma ORM parameterized queries

## 📝 Database Schema

The application uses the following main models:
- **User**: User accounts with authentication
- **Product**: Product catalog
- **Category**: Product categories
- **Cart**: Shopping cart
- **Order**: Order management
- **Review**: Product reviews
- **Address**: User addresses

## 🧪 Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## 📊 Logging

Logs are stored in the `logs/` directory:
- `error.log`: Error-level logs
- `all.log`: All logs

## 🔄 Development Workflow

1. Make changes to the code
2. The development server will auto-reload (nodemon)
3. Check logs for any errors
4. Test endpoints using Postman or similar tools

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `DATABASE_URL` with production database
3. Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
4. Configure `CORS_ORIGIN` to your frontend URL
5. Build the project: `npm run build`
6. Start the server: `npm start`

## 📦 NPM Scripts

- `npm run dev`: Start development server
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Start production server
- `npm run prisma:generate`: Generate Prisma Client
- `npm run prisma:migrate`: Run database migrations
- `npm run prisma:studio`: Open Prisma Studio
- `npm run lint`: Run ESLint

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT

## 🆘 Support

For issues or questions, please create an issue in the repository.
