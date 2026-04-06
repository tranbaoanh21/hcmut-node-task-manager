# 🚀 Task Manager API - Backend Service

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-success)

A production-ready RESTful API for task management, built with a focus on modularity, scalability, and security. This application leverages the **MERN** stack (backend focus) to handle complex CRUD operations and cloud data persistence.

---

## 🌟 Key Features
- **RESTful API Design**: Clean and predictable URL structures.
- **CRUD Operations**: Complete functionality to Create, Read, Update, and Delete tasks.
- **Cloud Database Integration**: Seamless connection to **MongoDB Atlas**.
- **Schema Validation**: Data integrity ensured via **Mongoose** models.
- **Error Handling**: Comprehensive middleware for catching and responding to API errors.
- **Security**: Environment variable protection via `dotenv`.

## 🛠 Tech Stack
- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **API Testing**: Postman
- **Version Control**: Git / GitHub

## 📂 Project Architecture
```text
.
├── controllers/    # Request handlers & Business logic
├── db/             # Database connection setup
├── middleware/     # Global error handlers & request logging
├── models/         # Data schemas & validation rules
├── public/         # Static assets for the frontend
├── routes/         # API endpoint definitions
├── .env            # Private configuration (Ignored by Git)
├── app.js          # Application entry point
└── package.json    # Dependency management