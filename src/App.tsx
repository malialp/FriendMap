import { useState } from "react";
import Graph from "./components/Graph.tsx";
import Menu from "./components/Menu.tsx";
import { Toaster } from "react-hot-toast";

import { Analytics } from "@vercel/analytics/react";

const App = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-black text-white overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className={`md:hidden fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg shadow-lg transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Menu */}
      <div
        className={`
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:relative z-40 h-full
          transition-transform duration-300 ease-in-out
          w-80 md:w-96 lg:w-1/3 xl:w-1/4 flex-shrink-0
        `}
      >
        <Menu onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Graph */}
      <div className="flex-1 h-full w-full md:w-auto">
        <Graph />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#374151",
            color: "#fff",
            border: "1px solid #4B5563",
          },
          success: {
            style: {
              background: "#059669",
            },
          },
          error: {
            style: {
              background: "#DC2626",
            },
          },
        }}
      />
      <Analytics />
    </div>
  );
};

export default App;
