# 📚 BookReviewHub API

A Node.js REST API for managing book reviews, user authentication, and comments using **Express**, **MongoDB**, and **JWT**.

---

## ✅ Features
- User registration & login (JWT authentication)
- CRUD operations for Books, Reviews, and Comments
- Secure password hashing (bcrypt)
- MongoDB Atlas integration
- MVC architecture for scalability
- Swagger API documentation

---

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication
- Render.com for deployment
- Swagger for API docs

---

## ⚙️ Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/bookreviewhub-api.git
   cd bookreviewhub-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```
   *(Add `"dev": "nodemon index.js"` in `package.json` scripts)*

---

## 🚀 Deploying to Render.com
1. Go to [Render](https://render.com).
2. Click **New → Web Service**.
3. Connect your GitHub repo.
4. Set **Build Command**:
   ```bash
   npm install
   ```
5. Set **Start Command**:
   ```bash
   npm start
   ```
6. Add **Environment Variables** in Render dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (Render assigns automatically)
7. Click **Deploy**.

---

## 📂 Project Structure
```
bookreviewhub-api/
├── index.js
├── package.json
├── /src
│   ├── /config
│   ├── /models
│   ├── /controllers
│   ├── /routes
│   ├── /middleware
│   └── /utils
```

---

## 📜 Swagger API Documentation Setup
1. Install Swagger dependencies:
   ```bash
   npm install swagger-ui-express swagger-jsdoc
   ```

2. Add Swagger setup in `index.js`:
   ```javascript
   const swaggerUi = require('swagger-ui-express');
   const swaggerJsdoc = require('swagger-jsdoc');

   const options = {
     definition: {
       openapi: '3.0.0',
       info: {
         title: 'BookReviewHub API',
         version: '1.0.0',
       },
     },
     apis: ['./src/routes/*.js'], // Path to route files
   };

   const specs = swaggerJsdoc(options);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
   ```

3. Document endpoints using JSDoc comments in route files:
   ```javascript
   /**
    * @swagger
    * /api/users/register:
    *   post:
    *     summary: Register a new user
    */
   ```

Access docs at: `(https://bookreviewhub-api.onrender.com)`

---

## 🤝 Contribution Guidelines
- Fork the repo & create a feature branch:
  ```bash
  git checkout -b feature/<feature-name>
  ```
- Commit changes:
  ```bash
  git commit -m "Add <feature-name>"
  ```
- Push branch:
  ```bash
  git push origin feature/<feature-name>
  ```
- Open a Pull Request.
