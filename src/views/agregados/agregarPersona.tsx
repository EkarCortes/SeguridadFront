import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, UserPlus, Camera, X, ImagePlus,
  User, Mail, Phone, Hash,
} from "lucide-react";
import { useFileUpload } from "../../hooks/agregados/useFileUpload";
import { agregadosService } from "../../service/agregados/agregadosService";
import { showCustomToast } from "../../components/Ui/CustomToaster";
import CustomToaster from "../../components/Ui/CustomToaster";
import ImageModal from "../../components/Ui/ImageModal";
import type { PersonFormData } from "../../types/agregados";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
}
function Field({ label, icon: Icon, required, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
        <input
          {...props}
          required={required}
          className="w-full rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#262c3e]/10 focus:border-slate-400 transition placeholder-slate-300 disabled:opacity-40"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>
    </div>
  );
}

export default function AgregarPersona() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ nombre: "", cedula: "", email: "", telefono: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const { selectedFiles, previews, handleFileChange, removeFile } = useFileUpload(5);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (selectedFiles.length >= 5) return;
    const syntheticEvent = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFileChange(syntheticEvent);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (selectedFiles.length === 0) {
      setError("Debe seleccionar al menos una foto.");
      return;
    }
    setIsSubmitting(true);
    try {
      const personData: PersonFormData = { ...form, fotos: selectedFiles };
      await agregadosService.registerPerson(personData);
      showCustomToast("Éxito", "Persona registrada correctamente.", "success");
      navigate("/listaAgregados");
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("Error al registrar la persona. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const remaining = 5 - selectedFiles.length;

  return (
    <div className="w-full flex flex-col gap-4">

      {/* ── Header ── */}
    
       <div className="flex flex-col sm:flex-row sm:items-start  gap-4 ml-1">
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl font-bold text-slate-900 leading-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Registrar Nueva Persona
          </h1>
       
            <p
              className="text-sm text-slate-500 mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Completa el formulario y adjunta las fotos biométricas
            </p>
       
        </div>

        
      </div>


      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* ── Sección: Datos personales ── */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-[3px] h-4 rounded-full bg-[#262c3e] flex-shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Datos personales
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Nombre completo" icon={User} name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Juan Pérez" disabled={isSubmitting} />
              <Field label="Cédula" icon={Hash} name="cedula" value={form.cedula} onChange={handleChange} required placeholder="1234567890" disabled={isSubmitting} />
              <Field label="Correo electrónico" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} required placeholder="correo@ejemplo.com" disabled={isSubmitting} />
              <Field label="Teléfono" icon={Phone} name="telefono" value={form.telefono} onChange={handleChange} required placeholder="0987654321" disabled={isSubmitting} />
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* ── Sección: Fotos biométricas ── */}
          <div className="px-6 py-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-[3px] h-4 rounded-full bg-[#262c3e] flex-shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Fotos biométricas
              </span>
              <div className="ml-auto flex items-center gap-1 rounded-lg px-2 py-0.5 bg-slate-100">
                <span className="text-xs font-bold text-slate-600">{selectedFiles.length}</span>
                <span className="text-xs text-slate-400">/5</span>
              </div>
            </div>

            {/* Bloque oscuro */}
            <div className="rounded-xl overflow-hidden" style={{ background: "#262c3e" }}>

              {/* En desktop: drop zone izquierda + fotos derecha */}
              <div className="hidden sm:flex items-stretch px-5 py-4">

                {/* Drop zone */}
                <div
                  onClick={() => remaining > 0 && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); if (remaining > 0) setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed transition-all select-none flex-shrink-0"
                  style={{
                    width: 160, minHeight: 140,
                    borderColor: isDragging ? "rgba(255,255,255,0.45)" : remaining === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.14)",
                    background: isDragging ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                    cursor: remaining === 0 ? "not-allowed" : "pointer",
                    opacity: remaining === 0 ? 0.45 : 1,
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: isDragging ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)" }}>
                    <Camera size={18} style={{ color: isDragging ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }} />
                  </div>
                  <div className="text-center px-2">
                    <p className="text-xs font-medium leading-snug" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
                      {remaining === 0 ? "Límite alcanzado" : isDragging ? "Suelta aquí" : "Clic o arrastra"}
                    </p>
                    {remaining > 0 && (
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.22)", fontFamily: "'Inter', sans-serif" }}>
                        {remaining} foto{remaining !== 1 ? "s" : ""} disponible{remaining !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                </div>

                <div className="flex-shrink-0 w-px mx-4 self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />

                {/* Fotos en fila */}
                <div className="flex-1 min-w-0 flex items-center gap-2.5">
                  {previews.length === 0
                    ? [0,1,2,3,4].map((i) => (
                        <div key={i} className="flex-1 rounded-xl border-2 border-dashed aspect-square flex items-center justify-center"
                          style={{ borderColor: "rgba(255,255,255,0.07)", maxWidth: 110 }}>
                          <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.12)" }}>{i + 1}</span>
                        </div>
                      ))
                    : <>
                        {previews.map((src, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden flex-shrink-0 cursor-zoom-in"
                            style={{ width: 110, height: 110, background: "rgba(255,255,255,0.05)" }}
                            onClick={() => setLightboxSrc(src)}>
                            <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold rounded px-1 py-0.5"
                              style={{ color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>{i + 1}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                              style={{ background: "rgba(239,68,68,0.9)" }}>
                              <X size={10} className="text-white" />
                            </button>
                          </div>
                        ))}
                        {previews.length < 5 && (
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all group flex-shrink-0"
                            style={{ width: 110, height: 110, borderColor: "rgba(255,255,255,0.10)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}>
                            <ImagePlus size={16} style={{ color: "rgba(255,255,255,0.2)" }} className="group-hover:!text-white/40 transition" />
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Añadir</span>
                          </button>
                        )}
                      </>
                  }
                </div>
              </div>

              {/* En móvil: drop zone arriba + grid de fotos abajo */}
              <div className="flex sm:hidden flex-col gap-3 px-4 py-4">

                {/* Drop zone compacta */}
                <div
                  onClick={() => remaining > 0 && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); if (remaining > 0) setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className="flex items-center gap-3 rounded-xl border-2 border-dashed px-4 py-3 transition-all select-none"
                  style={{
                    borderColor: isDragging ? "rgba(255,255,255,0.45)" : remaining === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.14)",
                    background: isDragging ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                    cursor: remaining === 0 ? "not-allowed" : "pointer",
                    opacity: remaining === 0 ? 0.45 : 1,
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,255,255,0.07)" }}>
                    <Camera size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {remaining === 0 ? "Límite alcanzado" : "Toca para añadir fotos"}
                    </p>
                    {remaining > 0 && (
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {remaining} foto{remaining !== 1 ? "s" : ""} disponible{remaining !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid de fotos en columnas */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-square cursor-zoom-in"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                        onClick={() => setLightboxSrc(src)}>
                        <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold rounded px-1 py-0.5"
                          style={{ color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>{i + 1}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                          className="absolute top-1.5 right-1.5 w-5 h-5 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                          style={{ background: "rgba(239,68,68,0.9)" }}>
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border-2 border-dashed aspect-square flex flex-col items-center justify-center gap-1 transition-all"
                        style={{ borderColor: "rgba(255,255,255,0.10)" }}>
                        <ImagePlus size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Añadir</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* ── Footer: acciones ── */}
          <div className="px-6 py-4 bg-slate-50/60 flex items-center justify-between gap-4">
            {error ? (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex-1 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                <span className="truncate">{error}</span>
              </div>
            ) : (
              <p className="text-xs text-slate-400 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} foto${selectedFiles.length > 1 ? "s" : ""} lista${selectedFiles.length > 1 ? "s" : ""}`
                  : "Sin fotos adjuntas aún"}
              </p>
            )}
            <div className="flex gap-2.5 flex-shrink-0">
              <button type="button" onClick={() => navigate("/listaAgregados")} disabled={isSubmitting}
                className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Cancelar
              </button>
              <button type="submit" disabled={isSubmitting}
                className="flex items-center gap-1.5 h-9 px-5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-slate-900/15"
                style={{ background: "#262c3e", fontFamily: "'Inter', sans-serif" }}>
                {isSubmitting ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Registrando...</>
                ) : (
                  <><UserPlus size={13} />Registrar</>
                )}
              </button>
            </div>
          </div>

        </div>
      </form>

      <ImageModal
        isOpen={!!lightboxSrc}
        imageUrl={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        alt="Vista ampliada"
      />
      <CustomToaster />
    </div>
  );
}
