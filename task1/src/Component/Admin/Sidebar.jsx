import { LayoutDashboard, Box, Layers } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Subcategories", path: "/admin/subcategories", icon: Layers },
    { name: "Products", path: "/admin/products", icon: Box },
    { name: "Users", path: "/admin/users", icon: Box },
    { name: "Orders", path: "/admin/orders", icon: Box },
  ];

  return (
    <div className="w-64 h-screen fixed top-0 left-0 bg-gray-900 text-white flex flex-col shadow-lg">

      {/* Logo / Title */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide">
          Admin Panel
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-[#019147] text-white shadow"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isActive ? "bg-white/20" : "bg-gray-800"
                }`}
              >
                <Icon size={18} />
              </div>

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
        © 2026 Admin Panel
      </div>
    </div>
  );
}