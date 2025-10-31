import { useState } from "react";
import { login as loginService } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = await loginService({ email, password });
      login(data.user, data.token);
      navigate("/profile");
    } catch (err) {
      setError("Invalid Credentials");
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>
        <img
          src="./assets/login.png"
          alt="Login icon"
          style={{ width: "24px", height: "24px", marginRight: "8px" }}
        />{" "}
        Login
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />{" "}
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />{" "}
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
