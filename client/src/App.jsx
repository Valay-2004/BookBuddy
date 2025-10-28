import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Books from "./pages/Books";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#f0f0f0" }}>
        <Link to="/">Home</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Books />} />
      </Routes>
    </Router>
  );
}

export default App;
