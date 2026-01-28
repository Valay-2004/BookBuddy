# BookBuddy

BookBuddy is a full-stack web application designed to help users manage their reading journey. It allows users to discover books, create personalized reading lists, track their reading progress, and share reviews with a community of book lovers.

Built with a modern technology stack, it features a responsive and aesthetic user interface, secure authentication, and a robust backend.

## 🚀 Key Features

*   **Authentication & User Management**: Secure Sign Up and Login functionality with role-based access (User/Admin).
*   **Book Management**: Browse a collection of books with detailed descriptions, authors, and cover images.
*   **Reading Lists**: Create, manage, and curate personal reading lists (public or private).
*   **Reviews & Ratings**: Rate books and write detailed reviews using a rich text editor.
*   **Responsive Design**: A beautiful, mobile-first interface built with Tailwind CSS and Radix UI.
*   **Admin Dashboard**: (If applicable) Administrative tools to manage the book database.

## 🛠️ Technology Stack

### Frontend (`/client`)
*   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/) (Primitives), `lucide-react` (Icons)
*   **State Management & Data Fetching**: `axios`, `react-hook-form`, `zod`
*   **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
*   **Routing**: `react-router-dom`

### Backend (`/server`)
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: `pg` (node-postgres)
*   **Authentication**: JSON Web Tokens (JWT) & bcrypt

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [PostgreSQL](https://www.postgresql.org/) (v13 or higher)
*   [Git](https://git-scm.com/)

## 📦 Installation & Setup

Follow these steps to get the project running locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BookBuddy
```

### 2. Database Setup

Ensure your PostgreSQL server is running. Then, create the database and tables using the provided SQL script.

1.  Open your terminal and log into the Postgres shell:
    ```bash
    psql -U postgres
    ```
2.  Run the initialization script (adjust the path if necessary):
    ```sql
    \i database/init.sql
    ```
    *Alternatively, you can manually run the SQL commands found in `database/init.sql`.*

### 3. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

**Configuration via Environment Variables**

Create a `.env` file in the `server` directory and add the following variables (adjust values to your local setup):

```env
PORT=3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookbuddy_db
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
# Server should be running on http://localhost:3000
```

### 4. Frontend Setup

Open a new terminal window, navigate to the client directory, and install dependencies:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
# Client should be running on http://localhost:5173
```

## 📂 Project Structure

```bash
BookBuddy/
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Login, Signup, etc.)
│   │   └── ...
│   └── package.json
├── server/           # Express backend application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API route definitions
│   │   └── ...
│   └── package.json
└── database/         # Database initialization scripts
    └── init.sql
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
