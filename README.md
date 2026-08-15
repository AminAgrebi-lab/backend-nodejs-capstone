# JavaScript Backend Capstone

A backend application developed as part of the **IBM JavaScript Backend Developer Professional Certificate**.

This project demonstrates practical backend development using **JavaScript, Node.js, Express, MongoDB, RESTful APIs, authentication, microservices, and DevOps practices**.

## 🚀 Project Overview

The goal of this capstone project is to design and implement a robust backend application using modern JavaScript backend technologies.

The application provides RESTful APIs for managing application data and users while demonstrating database integration, authentication, API testing, containerization, and deployment practices.

## ✨ Features

* RESTful API development with Node.js and Express
* MongoDB database integration
* CRUD operations
* User registration and authentication
* JWT-based authentication
* Secure API endpoints
* Error handling and API validation
* Microservices-based backend architecture
* Frontend integration
* API testing
* Containerized application
* CI/CD workflow
* Cloud deployment
* Kubernetes-based deployment

## 🛠️ Technologies Used

### Backend

* JavaScript
* Node.js
* Express.js
* REST APIs
* MongoDB
* JWT Authentication

### DevOps & Deployment

* Docker
* Kubernetes
* Git
* GitHub
* CI/CD
* Cloud deployment

### Database

* MongoDB
* NoSQL

## 📁 Project Structure

```text
backend-nodejs-capstone/
│
├── secondChance-backend/
│   ├── models/
│   │   └── db.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── secondChanceItemsRoutes.js
│   │   └── searchRoutes.js
│   │
│   ├── util/
│   │   └── import-mongo/
│   │
│   ├── app.js
│   ├── Dockerfile
│   └── package.json
│
├── secondChance-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── secondchancewebsite/
│   ├── build/
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
│
├── .github/
│   └── workflows/
│
├── deployment.yml
├── deploymongo.yml
└── README.md
```

> The exact structure may vary depending on the final project configuration.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/backend-nodejs-capstone.git
```

### 2. Navigate to the backend

```bash
cd backend-nodejs-capstone/secondChance-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3060
```

Do not commit your `.env` file to GitHub.

Add it to `.gitignore`:

```gitignore
.env
node_modules/
```

## ▶️ Running the Backend

Start the backend application with:

```bash
npm start
```

The backend runs locally on:

```text
http://localhost:3060
```

## 🗄️ Database

The application uses **MongoDB** as its NoSQL database.

The database connection is configured through environment variables so that sensitive credentials are not stored directly in the source code.

The project also includes functionality for importing sample data into MongoDB.

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Authenticate a user     |
| PUT    | `/api/auth/update`   | Update user information |

### Items

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/secondchance/items`     | Retrieve all items     |
| GET    | `/api/secondchance/items/:id` | Retrieve an item by ID |
| POST   | `/api/secondchance/items`     | Create a new item      |
| DELETE | `/api/secondchance/items/:id` | Delete an item         |

### Search

| Method | Endpoint                                          | Description  |
| ------ | ------------------------------------------------- | ------------ |
| GET    | `/api/secondchance/search?category=X&condition=Y` | Search items |

> Verify the endpoints against the final version of the application before publishing the README.

## 🔐 Authentication

The application uses **JSON Web Tokens (JWT)** to secure authenticated operations.

The authentication workflow includes:

1. User registration
2. User login
3. Credential verification
4. JWT generation
5. Authenticated API requests
6. Protected backend operations

Sensitive authentication information should always be stored in environment variables.

## 🧪 API Testing

The backend APIs can be tested using tools such as:

* Postman
* Insomnia
* curl

Example:

```bash
curl http://localhost:3060/api/secondchance/items
```

Authenticated endpoints require the appropriate JWT token.

## 🐳 Docker

The backend includes a Dockerfile for containerizing the application.

Build the Docker image:

```bash
docker build -t secondchance-backend .
```

Run the container:

```bash
docker run -p 3060:3060 secondchance-backend
```

## ☸️ Kubernetes

The project includes Kubernetes configuration files for deploying the application.

Example deployment:

```bash
kubectl apply -f deployment.yml
```

MongoDB deployment:

```bash
kubectl apply -f deploymongo.yml
```

Check running resources:

```bash
kubectl get pods
kubectl get services
```

## 🔄 CI/CD

The project uses **GitHub Actions** to automate parts of the development workflow.

The CI/CD workflow can be used to:

* Install dependencies
* Validate the application
* Run code quality checks
* Detect problems before deployment

Workflow files are located in:

```text
.github/workflows/
```

## 📚 Skills Demonstrated

This capstone demonstrates practical experience with:

* Backend web development
* JavaScript programming
* Node.js
* Express.js
* RESTful API design
* MongoDB
* CRUD operations
* Authentication
* JWT
* API security
* Microservices
* Error handling
* Database development
* Git and GitHub
* Docker
* Kubernetes
* CI/CD
* Cloud deployment

## 🎯 Learning Outcomes

Through this project, I applied backend development concepts to a realistic application and practiced designing APIs, connecting applications to MongoDB, securing endpoints, testing backend services, and preparing an application for containerized and cloud-based deployment.

## 📸 Screenshots

### Application

Add screenshots of the completed application here.

```text
screenshots/
├── login.png
├── register.png
├── dashboard.png
├── items.png
└── search.png
```

## 🎓 Course

This project was developed as the capstone project for the:

**IBM JavaScript Backend Developer Professional Certificate**

The project focuses on applying JavaScript backend development skills through a practical application.

## 👨‍💻 Author

**Amin Agrebi**

GitHub: [@AminAgrebi-lab](https://github.com/AminAgrebi-lab)

## 📄 License

This project is licensed under the ISC License.
