import React from "react";
import { Link, useLocation } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/tasks", label: "Tasks" },
    { path: "/notes", label: "Notes" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#242424] to-[#1a1a1a]">
      <header className="bg-[#1f1f1f]/80 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-[#f3d5a3] transition-colors">📚 Study Planner</Link>
          <nav>
            <ul className="flex space-x-2 sm:space-x-4">
              {navItems.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                      location.pathname === item.path
                        ? 'bg-[#fbf0df] text-[#1a1a1a] shadow-sm'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className=" py-8 px-4 sm:px-6 lg:px-8 w-full mx-auto">
        {children}
      </main>
      
      <footer className="bg-transparent py-4 text-center text-xs text-gray-400/70 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>Study Planner - Data is stored locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
}
