import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import EventPage from "./pages/EventPage/EventPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import RoulettePage from "./pages/EventPage/RoulettePage";
import Footer from "./components/Footer/Footer";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/games/beattheroulette" element={<RoulettePage />} />
        <Route path="/games/:id" element={<EventPage />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
