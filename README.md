# BookBuddy

BookBuddy is a full-stack web application designed to help users manage their reading journey. It allows users to discover books, create personalized reading lists, track their reading progress, and share reviews with a community of book lovers.

Built with a modern technology stack, it features a responsive and aesthetic user interface, secure authentication, and a robust backend.

## 🚀 Key Features

- **Authentication & User Management**: Secure Sign Up and Login functionality with role-based access (User/Admin).
- **Book Management**: Browse a collection of books with detailed descriptions, authors, and cover images.
- **Reading Lists**: Create, manage, and curate personal reading lists (public or private).
- **Reviews & Ratings**: Rate books and write detailed reviews using a rich text editor.
- **Responsive Design**: A beautiful, mobile-first interface built with Tailwind CSS and Radix UI.
- **Admin Dashboard**: Administrative tools to manage the book database.

## 🛠️ Technology Stack

### Frontend (`/client`)

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), `lucide-react` (Icons)
- **State Management & Data Fetching**: `axios`, `react-hook-form`, `zod`
- **Rich Text Editor**: [Tiptap](https://tiptap.dev/)
- **Routing**: `react-router-dom`

### Backend (`/server`)

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Security**: Helmet, CORS, Rate Limiting

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v13 or higher)
- [Git](https://git-scm.com/)

## 📦 Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BookBuddy
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

**Configure Environment Variables**

Copy the example environment file and update it with your local settings:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookbuddy_db
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

**Run Database Migrations**

The application automatically runs migrations on startup. Simply start the server:

```bash
npm run dev
```

**Seed the Database** (Optional)

To populate your database with sample books from Open Library:

```bash
npm run seed
```

**Update Book Metadata** (Fix summaries & covers)

If you have existing books with short descriptions or missing covers, you can enhance them using the Google Books API:

```bash
npm run update-metadata
```

> [!TIP]
> You can limit the number of books processed for testing: `node src/utils/update_metadata.js --limit=10`

### 3. Frontend Setup

Open a new terminal, navigate to the client directory:

```bash
cd client
npm install
```

**Configure Environment Variables**

Copy the example environment file:

```bash
cp .env.example .env
```

The default settings should work for local development. Update if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Production Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Set Environment Variables** in your hosting platform:

   ```env
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_production_secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Build Command**: Not required (Node.js apps run directly)

3. **Start Command**: `npm start`

4. **Database**: Ensure your PostgreSQL database is provisioned. The app will automatically run migrations on startup.

### Frontend Deployment (Vercel/Netlify)

1. **Set Environment Variables**:

   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   ```

2. **Build Command**: `npm run build`

3. **Output Directory**: `dist`

4. **Install Command**: `npm install`

## 📂 Project Structure

```bash
BookBuddy/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views
│   │   ├── context/     # React contexts (Auth, Theme)
│   │   └── services/    # API services
│   └── package.json
├── server/              # Express backend application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API route definitions
│   │   ├── middleware/  # Custom middleware
│   │   ├── models/      # Database models
│   │   └── utils/       # Utilities (seed, migrate)
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Books

- `GET /api/books` - List all books
- `POST /api/books` - Create book (Admin only)
- `GET /api/books/:id` - Get book details
- `DELETE /api/books/:id` - Delete book (Admin only)

### Reviews

- `POST /api/books/:id/reviews` - Create review
- `GET /api/books/:id/reviews` - Get book reviews

### Reading Lists

- `GET /api/reading-lists` - Get user's reading lists
- `POST /api/reading-lists` - Create new list
- `POST /api/reading-lists/:listId/books/:bookId` - Add book to list
- `DELETE /api/reading-lists/:listId/books/:bookId` - Remove book from list

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
