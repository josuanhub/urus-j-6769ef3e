import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  CloudUpload,
} from "lucide-react";

const UPLOAD_URL =
  "https://www.urusverify.com/v1/factory/project/6769ef3e-ee88-4623-9868-cde883366c4a/upload-data";

const ACCEPTED_TYPES = [
  ".xlsx",
  ".xls",
  ".csv",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
];

const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/pdf",
  "image/png",
  "image/jpeg",
];

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["xlsx", "xls", "csv"].includes(ext))
    return <FileSpreadsheet size={28} className="text-[#00D4AA]" />;
  if (ext === "pdf") return <FileText size={28} className="text-red-400" />;
  if (["png", "jpg", "jpeg"].includes(ext))
    return <Image size={28} className="text-[#6C63FF]" />;
  return <File size={28} className="text-gray-400" />;
}

function isValidFile(file) {
  const ext = "." + file.name.split(".").pop().toLowerCase();
  return (
    ACCEPTED_TYPES.includes(ext) || ACCEPTED_MIME.includes(file.type)
  );
}

export default function ImportarDatos() {
  const [state, setState] = useState("idle"); // idle | dragging | uploading | success | error
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationError, setValidationError] = useState("");
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  const handleFile = useCallback((file) => {
    setValidationError("");
    if (!file) return;
    if (!isValidFile(file)) {
      setValidationError(
        `Tipo de archivo no permitido. Acepta: ${ACCEPTED_TYPES.join(", ")}`
      );
      return;
    }
    setSelectedFile(file);
    setState("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setState("dragging");
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setState("idle");
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setState("idle");
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleUpload = useCallback(() => {
    if (!selectedFile) return;

    setState("uploading");
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open("POST", UPLOAD_URL);
    xhr.setRequestHeader("x-factory-key", "factory2026");

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        setProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          setResult(data);
          setState("success");
          setProgress(100);
        } catch {
          setResult({ raw: xhr.responseText });
          setState("success");
          setProgress(100);
        }
      } else {
        let msg = `Error ${xhr.status}`;
        try {
          const data = JSON.parse(xhr.responseText);
          msg = data?.message || data?.error || msg;
        } catch {}
        setErrorMsg(msg);
        setState("error");
      }
    });

    xhr.addEventListener("error", () => {
      setErrorMsg("Error de red al conectar con el servidor.");
      setState("error");
    });

    xhr.addEventListener("abort", () => {
      setErrorMsg("Carga cancelada.");
      setState("error");
    });

    xhr.send(formData);
  }, [selectedFile]);

  const handleCancel = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  }, []);

  const handleClear = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setSelectedFile(null);
    setState("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
    setValidationError("");
  }, []);

  const isDragging = state === "dragging";
  const isUploading = state === "uploading";
  const isSuccess = state === "success";
  const isError = state === "error";

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white px-4 py-8 md:px-8 lg:px-16">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#6C63FF]/10 border border-[#6C63FF]/20">
            <CloudUpload size={24} className="text-[#6C63FF]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Importar Datos
          </h1>
        </div>
        <p className="text-gray-400 text-sm md:text-base ml-1">
          Sube archivos al sistema j mediante arrastrar y soltar o selección
          manual.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Drop Zone */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`
            relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-4 p-10 md:p-16
            ${isDragging
              ? "border-[#6C63FF] bg-[#6C63FF]/10 scale-[1.01] shadow-lg shadow-[#6C63FF]/20"
              : "border-[#1A1A2E] bg-[#1A1A2E]/40 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5"
            }
            ${isUploading ? "cursor-not-allowed opacity-70" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleInputChange}
            className="hidden"
            disabled={isUploading}
          />

          <div
            className={`
            p-5 rounded-full transition-all duration-300
            ${isDragging
                ? "bg-[#6C63FF]/20 shadow-xl shadow-[#6C63FF]/30"
                : "bg-[#0A0A0F]/60"
              }
          `}
          >
            <Upload
              size={40}
              className={`transition-colors duration-300 ${isDragging ? "text-[#6C63FF]" : "text-gray-500"
                }`}
            />
          </div>

          <div className="text-center space-y-1">
            <p className="text-base md:text-lg font-semibold text-gray-200">
              {isDragging
                ? "Suelta el archivo aquí"
                : "Arrastra y suelta tu archivo"}
            </p>
            <p className="text-sm text-gray-500">
              o{" "}
              <span className="text-[#6C63FF] font-medium underline underline-offset-2">
                haz clic para seleccionar
              </span>
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {[".xlsx", ".xls", ".csv", ".pdf", ".png", ".jpg"].map((ext) => (
              <span
                key={ext}
                className="text-xs px-2 py-0.5 rounded-full bg-[#0A0A0F]/80 border border-[#1A1A2E] text-gray-400 font-mono"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>

        {/* Validation error */}
        {validationError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{validationError}</p>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && (
          <div className="rounded-2xl bg-[#1A1A2E]/60 border border-[#1A1A2E] p-5 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#0A0A0F]/80 border border-[#1A1A2E] shrink-0">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-100 truncate text-sm md:text-base">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatBytes(selectedFile.size)}
                </p>
              </div>
              {!isUploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                  title="Quitar archivo"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Progress bar */}
            {(isUploading || isSuccess || isError) && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>
                    {isUploading
                      ? "Subiendo..."
                      : isSuccess
                        ? "Completado"
                        : "Error"}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0A0A0F]/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isError
                        ? "bg-red-500"
                        : isSuccess
                          ? "bg-[#00D4AA]"
                          : "bg-[#6C63FF]"
                      }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-1">
              {!isUploading && !isSuccess && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-sm
                    bg-[#6C63FF] hover:bg-[#5a52e0] active:scale-95 transition-all duration-200 shadow-lg shadow-[#6C63FF]/20"
                >
                  <Upload size={16} />
                  Subir archivo
                </button>
              )}

              {isUploading && (
                <>
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-sm
                      bg-[#6C63FF]/50 cursor-not-allowed"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    Subiendo...
                  </button>
                  <button
                    onClick={handleCancel}
                    className="py-2.5 px-4 rounded-xl text-sm font-medium border border-red-500/30
                      text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              )}

              {(isSuccess || isError) && (
                <button
                  onClick={handleClear}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-sm
                    border border-[#1A1A2E] text-gray-300 hover:bg-[#1A1A2E] transition-colors"
                >
                  <Trash2 size={16} />
                  Limpiar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success Result */}
        {isSuccess && result && (
          <div className="rounded-2xl bg-[#00D4AA]/5 border border-[#00D4AA]/25 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={22} className="text-[#00D4AA] shrink-0" />
              <h3 className="font-bold text-[#00D4AA] text-base">
                Importación exitosa
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {result.filas_insertadas !== undefined && (
                <div className="rounded-xl bg-[#0A0A0F]/60 border border-[#00D4AA]/15 p-4 text-center">
                  <p className="text-2xl font-bold text-[#00D4AA]">
                    {result.filas_insertadas}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Filas insertadas</p>
                </div>
              )}
              {result.tabla && (
                <div className="rounded-xl bg-[#0A0A0F]/60 border border-[#6C63FF]/15 p-4 text-center">
                  <p className="text-base font-bold text-[#6C63FF] truncate">
                    {result.tabla}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Tabla destino</p>
                </div>
              )}
              {result.errores !== undefined && (
                <div
                  className={`rounded-xl bg-[#0A0A0F]/60 border p-4 text-center ${result.errores > 0
                      ? "border-red-500/20"
                      : "border-[#1A1A2E]"
                    }`}
                >
                  <p
                    className={`text-2xl font-bold ${result.errores > 0 ? "text-red-400" : "text-gray-400"
                      }`}
                  >
                    {result.errores}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Errores</p>
                </div>
              )}
            </div>

            {/* Raw response if no known fields */}
            {result.raw && (
              <div className="rounded-xl bg-[#0A0A0F]/80 border border-[#1A1A2E] p-4">
                <p className="text-xs text-gray-400 font-mono break-all">
                  {result.raw}
                </p>
              </div>
            )}

            {/* Extra fields */}
            {!result.raw && (
              <div className="rounded-xl bg-[#0A0A0F]/60 border border-[#1A1A2E] p-4 overflow-auto max-h-40">
                <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Error Result */}
        {isError && (
          <div className="rounded-2xl bg-red-500/5 border border-red-500/25 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <AlertCircle size={22} className="text-red-400 shrink-0" />
              <h3 className="font-bold text-red-400 text-base">
                Error en la importación
              </h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed pl-1">
              {errorMsg || "Ocurrió un error desconocido. Inténtalo de nuevo."}
            </p>
            <button
              onClick={handleUpload}
              className="flex items-center gap-2 text-sm text-[#6C63FF] hover:text-[#5a52e0] transition-colors font-medium"
            >
              <Upload size={14} />
              Reintentar
            </button>
          </div>
        )}

        {/* Instructions */}
        {!selectedFile && (
          <div className="rounded-2xl bg-[#1A1A2E]/30 border border-[#1A1A2E] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-300">
              ¿Cómo funciona?
            </h3>
            <ol className="space-y-2">
              {[
                "Arrastra tu archivo a la zona de carga o haz clic para seleccionarlo.",
                "Verifica el nombre y tamaño del archivo seleccionado.",
                "Presiona «Subir archivo» para iniciar la importación.",
                "Revisa el resultado: filas insertadas, tabla y errores.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-gray-400">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#6C63FF]/15 text-[#6C63FF] flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}