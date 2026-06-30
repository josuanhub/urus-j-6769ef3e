import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';

const navItems = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '4.5rem' : '16rem',
        backgroundColor: '#0A0A0F',
        borderRight: '1px solid rgba(108,99,255,0.15)',
      }}
    >
      {/* Header / Logo */}
      <div
        className="flex items-center justify-between px-3 py-4"
        style={{ borderBottom: '1px solid rgba(108,99,255,0.12)' }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Logo mark */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-lg w-9 h-9 font-bold text-white text-base select-none"
            style={{
              background: 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
            }}
          >
            j
          </div>
          {/* Logo text */}
          <span
            className={`font-semibold text-white whitespace-nowrap transition-all duration-300 ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
            style={{ fontSize: '1rem' }}
          >
            Sistema{' '}
            <span style={{ color: '#6C63FF' }}>j</span>
          </span>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="flex-shrink-0 flex items-center justify-center rounded-md w-7 h-7 transition-colors duration-200 focus:outline-none"
          style={{ color: '#6C63FF' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(108,99,255,0.12)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1">
        {navItems.length === 0 ? (
          <div
            className={`transition-all duration-300 ${
              collapsed ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {!collapsed && (
              <p
                className="text-xs px-3 py-2 select-none"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                Sin secciones configuradas
              </p>
            )}
          </div>
        ) : (
          navItems.map(item => {
            const Icon = item.icon || LayoutDashboard;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group relative focus:outline-none"
                style={{
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                  backgroundColor: isActive
                    ? 'rgba(108,99,255,0.18)'
                    : 'transparent',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor =
                      'rgba(108,99,255,0.08)';
                  if (!isActive)
                    e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                }}
                onMouseLeave={e => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = 'transparent';
                  if (!isActive)
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r"
                    style={{ backgroundColor: '#6C63FF' }}
                  />
                )}

                <Icon
                  size={18}
                  className="flex-shrink-0"
                  style={{ color: isActive ? '#6C63FF' : 'inherit' }}
                />

                <span
                  className={`text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  {item.label}
                </span>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span
                    className="pointer-events-none absolute left-full ml-3 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                    style={{
                      backgroundColor: '#1A1A2E',
                      color: '#ffffff',
                      border: '1px solid rgba(108,99,255,0.3)',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Footer / Company name */}
      <div
        className="px-3 py-4 flex items-center gap-2 overflow-hidden"
        style={{ borderTop: '1px solid rgba(108,99,255,0.12)' }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full w-8 h-8"
          style={{ backgroundColor: 'rgba(0,212,170,0.1)' }}
        >
          <Building2 size={15} style={{ color: '#00D4AA' }} />
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden ${
            collapsed ? 'opacity-0 w-0' : 'opacity-100'
          }`}
        >
          <p
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            j
          </p>
          <p
            className="text-xs whitespace-nowrap"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Sistema j
          </p>
        </div>
      </div>
    </aside>
  );
}