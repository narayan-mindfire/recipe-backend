# Backend - Recipe App

A full-stack recipe management backend built using **TypeScript**, **Express.js**, **MongoDB**, and **JWT-based authentication**. It supports file uploads and is documented using **Swagger**.

---

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/yourusername/your-repo.git
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Run in Development

```
npm run serve
```

This runs:

- `tsc --watch` for auto compilation
- `nodemon dist/index.js` to restart the app on changes

---

## Project Structure

```
backend/
│
├── src/
│   ├── config/            # DB connection, constants
│   ├── controllers/       # Route handlers
│   ├── middlewares/       # Auth, error, uploads, validators
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   ├── services/          # service files with implementation logic
│   ├── swagger/           # Swagger setup and docs
│   ├── utils/             # Helper functions (e.g., token generation)
│   └── index.ts           # Entry point
│
├── tests/                 # Integration and unit tests
├── dist/                  # Compiled output
├── uploads/               # Uploaded images (excluded from Git)
├── .env                   # Environment config
├── tsconfig.json          # TypeScript config
├── jest.config.js         # Jest test config
├── .eslintrc.js           # ESLint rules
└── README.md              # This file
```

---

## API Documentation

Once the server is running, visit:

```
http://localhost:5000/api-docs
```

Swagger UI is auto-generated from JSDoc comments in route files using `swagger-jsdoc`.

You can also access the raw OpenAPI schema at:

```
http://localhost:5000/swagger.json
```

---

## Static Files and Uploads

Uploaded images (like profile or recipe pictures) are served statically from:

```
http://localhost:5000/uploads/<filename>
```

Make sure the `uploads/` folder exists. It is excluded from version control via `.gitignore`.

---

## API Versioning

All endpoints are prefixed with `/api/v1`.

Example:

```
GET /api/v1/auth/login
```

---

## Scripts

| Script           | Description                             |
| ---------------- | --------------------------------------- |
| `npm run serve`  | Run in dev mode with TS watch + nodemon |
| `npm run build`  | Compile TS to JS in `dist/`             |
| `npm start`      | Run the compiled JS (after build)       |
| `npm run lint`   | Lint all files using ESLint             |
| `npm run format` | Format files using Prettier             |
| `npm run test`   | Run Jest tests                          |

---

## Features

- User Authentication with JWT and Refresh Tokens
- File Uploads using Multer
- MongoDB models with Mongoose
- API documentation with Swagger
- Protected routes and role-based access
- Form validation using Zod
- ESLint + Prettier setup
- Jest + Supertest testing framework

---

## Testing

Run tests with:

```
npm run test
```
