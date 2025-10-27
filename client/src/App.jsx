import Books from "./pages/Books";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Books />} />
      </Routes>
    </Router>
  );
}

export default App;
