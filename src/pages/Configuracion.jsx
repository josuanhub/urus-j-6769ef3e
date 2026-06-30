import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  Inbox,
} from "lucide-react";

const API_BASE = "https://www.urusverify.com/v1/client/6769ef3e-ee88-4623-9868-cde883366c4a/api";
const TABLA = "configuracion";
const HEADERS = { "x-factory-key": "factory2026" };
const PAGE_SIZE = 20;

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#00D4AA]/10 border-[#00D4AA]/40 text-[#00D4AA]"
              : "bg-red-500/10 border-red-500/40 text-red-400"
          }`}
          style={{ minWidth: 260 }}
        >
          {t.type === "success" ? (
            <Check size={16} className="shrink-0" />
          ) : (
            <AlertTriangle size={16} className="shrink-0" />
          )}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-7 w-7 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ onNew }) {
  return (
    <tr>
      <td colSpan={5}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center">
            <Inbox size={32} className="text-[#6C63FF]" />
          </div>
          <div className="text-center">
            <p className="text-white/70 font-medium">No hay configuraciones</p>
            <p className="text-white/30 text-sm mt-1">Comenzá creando tu primera configuración</p>
          </div>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Nueva Configuración
          </button>
        </div>
      </td>
    </tr>
  );
}

function ConfirmModal({ open, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#1A1A2E] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trash2 size={22} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">¿Eliminar registro?</h3>
            <p className="text-white/40 text-sm mt-1">Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormModal({ open, onClose, onSave, editData, loading }) {
  const [form, setForm] = useState({ clave: "", valor: "", descripcion: "", activo: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({
        clave: editData.clave || "",
        valor: editData.valor || "",
        descripcion: editData.descripcion || "",
        activo: editData.activo !== undefined ? editData.activo : true,
      });
    } else {
      setForm({ clave: "", valor: "", descripcion: "", activo: true });
    }
    setErrors({});
  }, [editData, open]);

  const validate = () => {
    const e = {};
    if (!form.clave.trim()) e.clave = "La clave es requerida";
    if (!form.valor.trim()) e.valor = "El valor es requerido";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1A1A2E] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center">
              <Settings size={16} className="text-[#6C63FF]" />
            </div>
            <h2 className="text-white font-semibold text-base">
              {editData ? "Editar Configuración" : "Nueva Configuración"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Clave <span className="text-[#6C63FF]">*</span>
            </label>
            <input
              value={form.clave}
              onChange={(e) => setForm({ ...form, clave: e.target.value })}
              placeholder="ej: site_name"
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:ring-2 transition-all ${
                errors.clave ? "border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50"
              }`}
            />
            {errors.clave && <p className="text-red-400 text-xs mt-1">{errors.clave}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Valor <span className="text-[#6C63FF]">*</span>
            </label>
            <input
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
              placeholder="Ingresá el valor"
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:ring-2 transition-all ${
                errors.valor ? "border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50"
              }`}
            />
            {errors.valor && <p className="text-red-400 text-xs mt-1">{errors.valor}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Descripción opcional"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50 transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
            <span className="text-white/70 text-sm font-medium">Estado activo</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, activo: !form.activo })}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.activo ? "bg-[#00D4AA]" : "bg-white/10"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
              {editData ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Configuracion() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [filterActivo, setFilterActivo] = useState("todos");

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}`, { headers: HEADERS });
      if (!res.ok) throw new Error("Error al cargar datos");
      const json = await res.json();
      const rows = Array.isArray(json) ? json : json.data || json.items || json.results || [];
      setData(rows);
    } catch {
      addToast("Error al cargar configuraciones", "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = data.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      Object.values(item).some((v) => String(v).toLowerCase().includes(q));
    const matchActivo =
      filterActivo === "todos" ||
      (filterActivo === "activo" && item.activo) ||
      (filterActivo === "inactivo" && !item.activo);
    return matchSearch && matchActivo;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleNew = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (row) => { setEditData(row); setModalOpen(true); };
  const handleDeleteConfirm = (id) => setDeleteId(id);

  const handleSave = async (form) => {
    setFormLoading(true);
    try {
      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `${API_BASE}/${TABLA}/${editData.id || editData._id}`
        : `${API_BASE}/${TABLA}`;
      const res = await fetch(url, {
        method,
        headers: { ...HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      addToast(editData ? "Configuración actualizada" : "Configuración creada");
      setModalOpen(false);
      fetchData();
    } catch {
      addToast("Error al guardar configuración", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${TABLA}/${deleteId}`, {
        method: "DELETE",
        headers: HEADERS,
      });
      if (!res.ok) throw new Error();
      addToast("Configuración eliminada");
      setDeleteId(null);
      fetchData();
    } catch {
      addToast("Error al eliminar configuración", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDisplayFields = (row) => {
    const id = row.id || row._id || "-";
    const clave = row.clave || row.nombre || row.name || row.key || Object.values(row)[1] || "-";
    const valor = row.valor || row.value || row.descripcion || Object.values(row)[2] || "-";
    const activo = row.activo !== undefined ? row.activo : null;
    return { id, clave, valor, activo };
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal
        open={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editData={editData}
        loading={formLoading}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C63FF]/30 to-[#00D4AA]/10 border border-[#6C63FF]/20 flex items-center justify-center">
              <Settings size={22} className="text-[#6C63FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Configuración del sistema</h1>
              <p className="text-white/40 text-sm mt-0.5">Sistema j — Gestión de parámetros</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-10 h-10 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5a52e0] text-white text-sm font-semibold transition-colors shadow-lg shadow-[#6C63FF]/20"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nueva Configuración</span>
              <span className="sm:hidden">Nueva</span>
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: data.length, color: "text-[#6C63FF]", bg: "bg-[#6C63FF]/10" },
            { label: "Activos", value: data.filter((d) => d.activo).length, color: "text-[#00D4AA]", bg: "bg-[#00D4AA]/10" },
            { label: "Inactivos", value: data.filter((d) => !d.activo && d.activo !== undefined).length, color: "text-white/50", bg: "bg-white/5" },
            { label: "Filtrados", value: filtered.length, color: "text-white/70", bg: "bg-white/5" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl px-4 py-3 border border-white/5`}>
              <p className="text-white/30 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{loading ? "—" : s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar configuraciones..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>