import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return;
      const response = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    }
    fetchProfile();
  }, [token]);

  if (!token) return <p>⚠️ Please log in first ⚠️</p>;
  if (!profile) return <p> Loading Profile...</p>;

  // return the page
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🙂 Profile</h2>
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>

      <h3>Your Reviews</h3>
      {profile.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {profile.reviews.map((r) => (
            <li key={r.review_id}>
              {r.book_title} - {r.rating}🌟
              <br />"{r.review_text}"
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
