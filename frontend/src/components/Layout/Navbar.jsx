import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userName = user.name || "Guest";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("questions");
    localStorage.removeItem("interviewAnswers");
    localStorage.removeItem("interviewData");
    localStorage.removeItem("resumeAnalysis");

    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome {userName} 👋</h2>
        <p className="text-gray-400">AI Interview Platform</p>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-white text-2xl hover:scale-110 transition">
          🔔
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3"
          >
            <img
              src={
                user.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName
                )}&background=2563eb&color=fff`
              }
              alt={userName}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-4 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden z-50">
              <div className="p-5 border-b border-slate-700">
                <h3 className="text-white font-bold">{userName}</h3>
                <p className="text-gray-400 text-sm mt-1">{user.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-5 py-4 text-white hover:bg-slate-800"
              >
                👤 My Profile
              </Link>

              <Link
                to="/history"
                onClick={() => setOpen(false)}
                className="block px-5 py-4 text-white hover:bg-slate-800"
              >
                📜 Interview History
              </Link>

              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="block px-5 py-4 text-white hover:bg-slate-800"
              >
                ⚙️ Settings
              </Link>

              <button
                onClick={logout}
                className="w-full text-left px-5 py-4 text-red-400 hover:bg-slate-800"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
