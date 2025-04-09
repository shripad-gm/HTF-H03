import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import TextToSpeechButton from "./components/TextToSpeechButton"; // Import TTS button
import "./App.css";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="main-layout">
        {/* Sidebar with animated class */}
        <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`} >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main content area with shift logic */}
        <div
          className={`content-area ${
            isSidebarOpen ? "with-sidebar" : "full-width"
          }`}
        >
          <Navbar />
          <Home />
        </div>
      </div>

      {/* Sidebar toggle button */}
      {!isSidebarOpen && (
        <button className="open-sidebar-btn" onClick={() => setIsSidebarOpen(true)}>
          ☰
        </button>
      )}

      {/* Text to Speech Button */}
      <TextToSpeechButton />
    </div>
  );
};

export default App;
