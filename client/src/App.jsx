import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#eee" }}>
        <Link to="/">Books</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/signup">Signup</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
