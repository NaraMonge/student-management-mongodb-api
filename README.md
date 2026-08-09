# Student Management System - MongoDB REST API

Full-stack academic application for managing student academic records using **Node.js, Express, MongoDB, JavaScript, jQuery and AJAX**.

The project combines a REST API, a web interface and a MongoDB database with validation rules, indexes, CRUD operations and aggregation queries.

## Project Overview

The system manages student records including:

- Student ID
- Full name
- Subject
- Three grades
- Average grade
- Academic status
- Academic term

The application allows users to create, read, update and delete student records through a browser interface connected to a REST API.

## Main Features

- REST API built with Node.js and Express
- MongoDB database integration
- CRUD operations for student records
- MongoDB JSON Schema validation
- Compound index creation
- Automated database setup with 25 sample documents
- Parameterized queries
- Aggregation pipelines
- Web interface using HTML, JavaScript, jQuery and AJAX
- MongoDB backup files included for database restore practice

## Academic Queries Implemented

The API includes endpoints for:

- Students approved with excellence
- Search by academic term and student name
- Students with averages below 70
- Average grade by academic term
- Lowest grade for a specific student
- Literature average by academic term

These queries use MongoDB `find()` operations and aggregation pipelines with stages such as `$match`, `$group`, `$project`, `$sort` and `$limit`.

## Technologies

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express | REST API |
| MongoDB | NoSQL database |
| MongoDB Node.js Driver | Database connectivity |
| JavaScript | Application logic |
| jQuery / AJAX | Frontend-to-API communication |
| HTML / CSS | Web interface |
| Postman | API testing |
| dotenv | Environment configuration |

## Repository Structure

```text
.
├── backend/
│   ├── scripts/
│   │   └── setupDB.js
│   ├── .env.example
│   ├── db.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
├── mongodb-backup/
├── .gitignore
└── README.md
```

## How to Run

### 1. Requirements

Install:

- Node.js
- MongoDB
- npm

### 2. Configure the backend

Open the `backend` folder and create a `.env` file based on `.env.example`.

Example:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017
DB_NAME=student_management
COLLECTION_NAME=estudiantes
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the database and sample data

```bash
npm run setup
```

This creates the collection validator, index and 25 sample documents.

### 5. Start the API

```bash
npm run dev
```

The API will run at:

```text
http://localhost:3000
```

### 6. Open the frontend

Open:

```text
frontend/index.html
```

## API Operations

```text
GET    /api/estudiantes
GET    /api/estudiantes/:id
POST   /api/estudiantes
PUT    /api/estudiantes/:id
DELETE /api/estudiantes/:id
```

The application also includes endpoints for specialized academic queries under:

```text
/api/consultas/
```

## Academic Context

Individual academic simulation developed for the course **Base de Datos NoSQL (SC-609)** at **Universidad Fidélitas**.

This repository is maintained by **Náraly Monge Contreras** as part of her portfolio in data science, software development and database technologies.

## Skills Applied

- NoSQL database design
- MongoDB
- REST API development
- Node.js / Express
- CRUD operations
- JSON Schema validation
- Indexes
- Aggregation pipelines
- Frontend/API integration
- AJAX
- Database backup and restore
- API testing
- Environment configuration

---

**Náraly Monge Contreras**  
Data Science | Software Development | Databases | Artificial Intelligence
