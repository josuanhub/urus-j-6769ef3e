import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Zap,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import ImportarDatos from "./pages/ImportarDatos";
import Configuracion from "./pages/Configuracion";

const NAV_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/importar-datos",
    label: "Importar Datos",
    icon: Upload,
  },
  {
    path: "/configuracion",
    label: "Configuración",
    icon: Settings,
  },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Header */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Sistema j
            </span>
          </div>
        )}
        {collapsed && (
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
          >
            <Zap size={16} className="text-white" />
          </div>
        )}
        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))",
                      boxShadow: "inset 0 0 0 1px rgba(108,99,255,0.4)",
                    }
                  : {}
              }
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #6C63FF, #00D4AA)",
                  }}
                />
              )}
              <Icon
                size={18}
                className={`flex-shrink-0 transition-colors ${
                  isActive ? "text-[#6C63FF]" : ""
                }`}
                style={isActive ? { color: "#6C63FF" } : {}}
              />
              {!collapsed && (
                <span className="text-sm font-medium">{label}</span>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1A1A2E] border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-xl">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              J
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">
                Sistema j
              </p>
              <p className="text-gray-500 text-xs truncate">v1.0.0</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}
            >
              J
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "260px",
          background: "#1A1A2E",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out"
        style={{
          width: collapsed ? "72px" : "240px",
          background: "#1A1A2E",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const currentPage =
    NAV_ITEMS.find((item) => item.path === location.pathname)?.label ||
    "Sistema j";

  return (
    <header
      className="flex-shrink-0 flex items-center gap-4 px-4 md:px-6 h-16 border-b border-white/10"
      style={{ background: "rgba(26,26,46,0.6)", backdropFilter: "blur(10px)" }}
    >
      {/* Mobile menu toggle */}
      <button
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-white font-semibold text-base md:text-lg truncate">
          {currentPage}
        </h1>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "#00D4AA" }}
        />
        <span className="text-xs text-gray-400 hidden sm:block">
          Conectado
        </span>
      </div>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ background: "#0A0A0F" }}
    >
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/importar-datos" element={<ImportarDatos />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}