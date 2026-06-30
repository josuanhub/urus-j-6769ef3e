import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Clock,
  Zap,
} from "lucide-react";

const API_BASE =
  "https://www.urusverify.com/v1/client/6769ef3e-ee88-4623-9868-cde883366c4a/api";
const HEADERS = { "x-factory-key": "factory2026" };

const TABLES = [
  {
    id: "usuarios",
    label: "Usuarios Totales",
    icon: Users,
    color: "#6C63FF",
    bg: "from-[#6C63FF]/20 to-[#6C63FF]/5",
    border: "border-[#6C63FF]/30",
    trend: +12,
  },
  {
    id: "verificaciones",
    label: "Verificaciones",
    icon: ShieldCheck,
    color: "#00D4AA",
    bg: "from-[#00D4AA]/20 to-[#00D4AA]/5",
    border: "border-[#00D4AA]/30",
    trend: +8,
  },
  {
    id: "alertas",
    label: "Alertas Activas",
    icon: AlertTriangle,
    color: "#FF6B6B",
    bg: "from-[#FF6B6B]/20 to-[#FF6B6B]/5",
    border: "border-[#FF6B6B]/30",
    trend: -3,
  },
  {
    id: "actividad",
    label: "Actividad Registrada",
    icon: Activity,
    color: "#00D4AA",
    bg: "from-[#00D4AA]/20 to-[#6C63FF]/5",
    border: "border-[#00D4AA]/30",
    trend: 0,
  },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A2E] p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-white/10" />
        <div className="w-16 h-5 rounded-full bg-white/10" />
      </div>
      <div className="w-20 h-8 rounded-lg bg-white/10 mb-2" />
      <div className="w-28 h-4 rounded bg-white/10" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded bg-white/10 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

function TrendBadge({ value }) {
  if (value > 0)
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
        <TrendingUp size={11} /> +{value}%
      </span>
    );
  if (value < 0)
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
        <TrendingDown size={11} /> {value}%
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
      <Minus size={11} /> 0%
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    urgente: "bg-red-500/20 text-red-400 border border-red-500/30",
    activo: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    pendiente: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    inactivo: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
  };
  const cls = map[status?.toLowerCase()] || "bg-white/10 text-white/60 border border-white/10";
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {status || "—"}
    </span>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchKPIs = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        TABLES.map((t) =>
          fetch(`${API_BASE}/${t.id}`, { headers: HEADERS }).then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
          })
        )
      );

      const counts = {};
      results.forEach((res, idx) => {
        const table = TABLES[idx];
        if (res.status === "fulfilled") {
          const data = res.value;
          const arr = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.results)
            ? data.results
            : [];
          counts[table.id] = arr.length;
        } else {
          counts[table.id] = null;
        }
      });

      setKpis(counts);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Error al cargar los KPIs. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    setActivityLoading(true);
    try {
      const res = await fetch(`${API_BASE}/actividad`, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      const sorted = [...arr].sort((a, b) => {
        const da = new Date(a.fecha || a.createdAt || a.created_at || 0);
        const db = new Date(b.fecha || b.createdAt || b.created_at || 0);
        return db - da;
      });

      setRecentActivity(sorted.slice(0, 10));

      const urgentes = arr.filter(
        (item) => item.estado?.toLowerCase() === "urgente"
      );
      setCriticalAlerts(urgentes);
    } catch {
      setRecentActivity([]);
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchKPIs();
    fetchActivity();
  }, []);

  const handleRefresh = () => {
    fetchKPIs();
    fetchActivity();
  };

  const formatValue = (val) => {
    if (val === null || val === undefined) return "—";
    if (val >= 1000000) return (val / 1000000).toFixed(1) + "M";
    if (val >= 1000) return (val / 1000).toFixed(1) + "K";
    return val.toString();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("es-ES", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const getRowLabel = (item) => {
    return (
      item.nombre ||
      item.name ||
      item.titulo ||
      item.title ||
      item.descripcion ||
      item.description ||
      `Registro #${item.id || "—"}`
    );
  };

  const getRowType = (item) => {
    return item.tipo || item.type || item.categoria || item.category || "—";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#00D4AA]">
                Dashboard
              </span>
              <span className="text-white/80 font-light ml-2 text-lg">Sistema j</span>
            </h1>
            {lastUpdated && (
              <p className="text-xs text-white/30 mt-0.5 flex items-center gap-1">
                <Clock size={10} />
                Actualizado: {lastUpdated.toLocaleTimeString("es-ES")}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading && activityLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A2E] border border-white/10 text-white/60 hover:text-white hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/10 transition-all duration-200 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw
              size={14}
              className={loading || activityLoading ? "animate-spin" : ""}
            />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <AlertTriangle size={18} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 overflow-hidden">
            <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-red-500/20 bg-red-500/10">
              <Zap size={16} className="text-red-400 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">
                {criticalAlerts.length} Alerta{criticalAlerts.length !== 1 ? "s" : ""} Crítica{criticalAlerts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="divide-y divide-red-500/10">
              {criticalAlerts.slice(0, 3).map((alert, i) => (
                <div key={i} className="flex items-center gap-3 px-4 sm:px-6 py-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                  <p className="text-sm text-white/80 flex-1 truncate">
                    {getRowLabel(alert)}
                  </p>
                  <span className="text-xs text-white/30 shrink-0 hidden sm:block">
                    {formatTime(alert.fecha || alert.createdAt || alert.created_at)}
                  </span>
                </div>
              ))}
              {criticalAlerts.length > 3 && (
                <div className="px-4 sm:px-6 py-2 text-xs text-red-400/70">
                  +{criticalAlerts.length - 3} alertas más
                </div>
              )}
            </div>
          </div>
        )}

        {/* KPI Grid */}
        <section>
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
            Indicadores Clave
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : TABLES.map((table) => {
                  const Icon = table.icon;
                  const count = kpis[table.id];
                  return (
                    <div
                      key={table.id}
                      className={`relative rounded-2xl border ${table.border} bg-gradient-to-br ${table.bg} bg-[#1A1A2E] p-4 sm:p-6 overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
                    >
                      {/* Glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${table.color}15, transparent 70%)`,
                        }}
                      />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                            style={{ background: `${table.color}20` }}
                          >
                            <Icon
                              size={20}
                              style={{ color: table.color }}
                            />
                          </div>
                          <TrendBadge value={table.trend} />
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                          {count !== null && count !== undefined
                            ? formatValue(count)
                            : <span className="text-white/20 text-xl">—</span>}
                        </p>
                        <p className="text-xs sm:text-sm text-white/50 font-medium leading-tight">
                          {table.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </section>

        {/* Recent Activity Table */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest">
              Actividad Reciente
            </h2>
            <span className="text-xs text-white/20">
              Últimos 10 registros
            </span>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#1A1A2E] overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/3">
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activityLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : recentActivity.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-white/20 text-sm"
                      >
                        No hay actividad reciente registrada
                      </td>
                    </tr>
                  ) : (
                    recentActivity.map((item, i) => (
                      <tr
                        key={item.id || i}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors duration-150"
                      >
                        <td className="px-4 sm:px-6 py-3 text-white/20 text-xs font-mono">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-white/80 max-w-[200px] truncate">
                          {getRowLabel(item)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-white/40 text-xs capitalize">
                          {getRowType(item)}
                        </td>
                        <td className="px-4 sm:px-6 py-3">
                          <StatusBadge status={item.estado} />
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-white/30 text-xs">
                          {formatTime(
                            item.fecha || item.createdAt || item.created_at
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-white/5">
              {activityLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 space-y-2 animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-4 w-32 rounded bg-white/10" />
                      <div className="h-4 w-16 rounded-full bg-white/10" />
                    </div>
                    <div className="h-3 w-24 rounded bg-white/10" />
                  </div>
                ))
              ) : recentActivity.length === 0 ? (
                <div className="p-8 text-center text-white/20 text-sm">
                  No hay actividad reciente
                </div>
              ) : (
                recentActivity.map((item, i) => (
                  <div key={item.id || i} className="p-4 hover:bg-white/3 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-white/80 font-medium truncate flex-1">
                        {getRowLabel(item)}
                      </p>
                      <StatusBadge status={item.estado} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/30">
                      <span>{getRowType(item)}</span>
                      <span>·</span>
                      <span>
                        {formatTime(item.fecha || item.createdAt || item.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center justify-center pt-2 pb-4">
          <p className="text-xs text-white/15 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] inline-block animate-pulse" />
            Sistema j — conectado a urusverify.com
          </p>
        </div>
      </div>
    </div>
  );
}