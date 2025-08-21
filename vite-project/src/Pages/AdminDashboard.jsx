import { useState } from "react";
import { Briefcase, LayoutDashboard, Settings, Users } from "lucide-react";
import Jobpost from "../components/Jobpost";

export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Post Job", icon: <Briefcase size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  // Function to render content based on active menu
  const renderContent = () => {
    switch (active) {
      case "Dashboard":
        return <p>📊 Welcome to the Admin Dashboard.</p>;
      case "Post Job":
        return <Jobpost/>; // Render JobPost component here
      case "Settings":
        return <p>⚙️ Configure your settings here.</p>;
      default:
        return <p>Welcome!</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h1 className="text-2xl font-bold text-indigo-600 mb-8">Employer Dashboard</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center w-full gap-3 p-3 rounded-lg transition 
                ${active === item.name
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-indigo-100 text-gray-700"}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{active}</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
