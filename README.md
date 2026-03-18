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
- **Caching**: RFC-compliant API caching with `stale-while-revalidate`
- **Performance**: Denormalized review stats & Trigram-based search

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

Copy the example environment file and update it with your settings.

> [!IMPORTANT]
> If using **Supabase**, use the **Transaction Pooler** URL (port `6543`) for better stability.

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

**Run Database Migrations**

The application features a **self-healing migration system** that automatically ensures your schema is correct, deduplicates data, and standardizes indexes on startup. Simply start the server:

```bash
npm run dev
```

**Populate Database (Automated & Manual)**

1. **Automated Seeding**: `seed.js` is optimized for production cron jobs (e.g., **Render Cron**). It fetches Daily/Weekly **Trending Books** and core subjects.
   ```bash
   # Run once manually if needed
   node src/utils/seed.js
   ```
2. **Quality Bar**: Our seeding process automatically filters for high-quality data (requires Large covers and substantial summaries).

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

## 🚀 Key Production Features

### 1. Automation with Render Cron

- **Schedule**: Set up a Cron Job on Render to run `node src/utils/seed.js` every 15 days (`0 0 */15 * *`).
- **Refresh**: The "Trending Now" sidebar automatically randomizes from a pool of trending titles on every load.

### 2. Preventing Spin-down (Optional)

If deploying to services like **Render (Free Tier)**, the backend may spin down after 15 minutes of inactivity. We include a `keepAlive` utility that pings the server every 10 minutes to prevent this.

To enable it:

1. Open `server/server.js`.
2. Uncomment the `require` for `startKeepAlive` (around line 91).
3. Uncomment the `startKeepAlive()` call inside `app.listen()` (around line 97).

### 3. API Caching (Performance)

The backend implements a smart caching strategy using `Cache-Control` headers:
- **Public Cache**: Responses can be cached by browsers and CDNs.
- **Stale-While-Revalidate**: Allows serving slightly outdated content while refreshing it in the background, ensuring near-instant load times for repeated requests.
- **Granular Control**: Different TTLs (Time-To-Live) for list views (60s) vs. individual book details (300s).

### 4. Database Performance & Search

- **Denormalization**: Book ratings and review counts are stored directly on the `books` table and kept in sync via **PostgreSQL Triggers**. This eliminates expensive `JOIN` and `AVG` operations on every list request.
- **Search Efficiency**: Uses the `pg_trgm` extension for **Trigram-based indexing**. This allows for extremely fast case-insensitive partial matching (`ILIKE`) even as the database grows.
- **Self-Healing Migrations**: The `migrate.js` utility automatically handles schema drift, column renaming, and index creation on every server start.

### 5. Sorting & Discovery

- **Sorting**: Organize the library by **Latest Added**, **Name (A-Z)**, or **Publication Year**.
- **Deep Linking**: All search and sort states are persisted in the URL for easy sharing.

### 6. Optimized Reading Experience

- **Direct Access**: "Read" buttons point directly to the Project Gutenberg HTML cache or the Archive.org viewer.

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

- `GET /api/books?page=1&sortBy=newest` - List books with sorting
- `POST /api/books` - Create book (Admin only)
- `GET /api/books/search?q=` - Search titles/authors
- `GET /api/books/top-rated` - Get editor's pick
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
