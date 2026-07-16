import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "🏠",
  },
  {
    title: "Resume ATS",
    path: "/resume-upload",
    icon: "📄",
  },
  {
    title: "Interview",
    path: "/interview-setup",
    icon: "🎤",
  },
  {
    title: "Adaptive AI",
    path: "/adaptive-interview",
    icon: "🤖",
  },
  {
    title: "History",
    path: "/history",
    icon: "📊",
  },
  {
    title: "Coding",
    path: "/coding",
    icon: "💻",
  },
];

function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800">

      <div className="p-8">

        <h1 className="text-3xl font-bold text-white">

          AI Interview

        </h1>

        <p className="text-gray-400 mt-2">

          Industry Platform

        </p>

      </div>

      <nav className="px-4 space-y-2">

        {menus.map((menu) => (

          <NavLink
            key={menu.title}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800"
              }`
            }
          >
            <span className="text-2xl">

              {menu.icon}

            </span>

            <span className="font-semibold">

              {menu.title}

            </span>

          </NavLink>

        ))}

      </nav>
    </aside>
  );
}

export default Sidebar;