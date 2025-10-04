# Simple JWT and CRUD Project

This is a full-stack project demonstrating a simple implementation of user authentication using JSON Web Tokens (JWT) and a complete set of CRUD (Create, Read, Update, Delete) operations. The backend is built with Node.js and Express, storing data in JSON files, while the frontend is a responsive single-page application built with React and styled with Tailwind CSS.

## Features

-   **Authentication:** Secure user registration and login system.
-   **JWT Protection:** Uses JSON Web Tokens to authenticate API requests and protect routes.
-   **Password Hashing:** Employs `bcrypt` to hash and secure user passwords.
-   **Full CRUD Functionality:** Implements Create, Read, Update, and Delete operations for products.
-   **RESTful API:** A clear and simple API built with Express.js for handling application logic.
-   **React Frontend:** A dynamic and responsive UI built with React, Vite, and React Router.
-   **Modern Styling:** A clean, modal-based user interface styled with Tailwind CSS.

## Tech Stack

-   **Backend:** Node.js, Express.js, `jsonwebtoken`, `bcrypt`, `cors`
-   **Frontend:** React, Vite, React Router, Axios, Tailwind CSS

## Getting Started

Follow these instructions to get a local copy of the project up and running on your machine.

### Prerequisites

-   Node.js (v18.0 or higher recommended)
-   npm (Node Package Manager)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/FelipeCattoSilva/Simple-JWT-and-CRUD-Project.git
    cd Simple-JWT-and-CRUD-Project
    ```

2.  **Setup the Backend:**
    -   Navigate to the backend directory:
        ```sh
        cd backend
        ```
    -   Install the necessary dependencies:
        ```sh
        npm install
        ```
    -   Create a `.env` file in the `backend` directory and add a secret key for JWT:
        ```env
        JWT_SECRET=your_super_secret_key_here
        ```
    -   Start the backend server:
        ```sh
        npm run dev
        ```
    -   The server will start on `http://localhost:8000`.

3.  **Setup the Frontend:**
    -   Open a new terminal and navigate to the frontend directory:
        ```sh
        cd frontend
        ```
    -   Install the necessary dependencies:
        ```sh
        npm install
        ```
    -   Start the frontend development server:
        ```sh
        npm run dev
        ```
    -   The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Usage

Once both the backend and frontend servers are running:
1.  Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`).
2.  You can either register a new account or log in if you have already created one.
3.  Upon successful login, you will be redirected to the dashboard.
4.  On the dashboard, you can view, create, edit, and delete products.

## API Endpoints

The backend provides the following API endpoints, running on `http://localhost:8000`.

| Method | Endpoint         | Protection  | Description                                                         |
| :----- | :--------------- | :---------- | :------------------------------------------------------------------ |
| `POST` | `/register`      | Public      | Creates a new user account.                                         |
| `POST` | `/login`         | Public      | Authenticates a user and returns a JWT.                             |
| `GET`  | `/dashboard`     | **Private** | Retrieves the logged-in user's details and the list of all products.|
| `GET`  | `/product`       | Public      | Retrieves a list of all products.                                   |
| `POST` | `/product`       | **Private** | Adds a new product.                                                 |
| `PATCH`| `/product`       | Public      | Updates an existing product's details by ID.                        |
| `DELETE`| `/product/:id`  | Public      | Deletes a product by its ID.                                        |

*Note: For protected routes, an `Authorization: Bearer <token>` header must be included in the request.*
