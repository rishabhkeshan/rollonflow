import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import EventPage from "./pages/EventPage/EventPage";
import LandingPage from "./pages/LandingPage/LandingPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/games/:id" element={<EventPage />} />

    </Routes>
  );
}

export default App;
