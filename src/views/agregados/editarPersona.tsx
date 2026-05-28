import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserPen, Camera, X, ImagePlus, User, Mail, Phone, Hash } from "lucide-react";
import { useFileUpload } from "../../hooks/agregados/useFileUpload";
import { agregadosService } from "../../service/agregados/agregadosService";
import { showCustomToast } from "../../components/Ui/CustomToaster";
import CustomToaster from "../../components/Ui/CustomToaster";
import ImageModal from "../../components/Ui/ImageModal";
import type { ExtendedPersona } from "../../components/table/personasColumns";
import noUser from "../../assets/noUser.jpg";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
}
function Field({ label, icon: Icon, required, disabled, ...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}{required && <span className="text-red-400 ml-1">*</span>}
        {disabled && <span className="ml-2 normal-case font-normal text-slate-300">(no editable)</span>}
      </label>
      <div className="relative">
        <Icon size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${disabled ? "text-slate-200" : "text-slate-300"}`} />
        <input
          {...props}
          required={required}
          disabled={disabled}
          className={`w-full rounded-xl border text-sm pl-10 pr-4 py-2.5 focus:outline-none transition
            ${disabled
              ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-50 border-slate-200 text-slate-800 focus:ring-2 focus:ring-[#262c3e]/10 focus:border-slate-400 placeholder-slate-300"
            }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>
    </div>
  );
}

export default function EditarPersona() {
  const navigate = useNavigate();
  const location = useLocation();
  const persona = (location.state as { persona: ExtendedPersona } | null)?.persona;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    nombre: persona?.nombre ?? "",
    cedula: persona?.cedula ?? "",
    email: persona?.email ?? "",
    telefono: persona?.telefono ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { selectedFiles, previews, handleFileChange, removeFile } = useFileUpload(5);

  useEffect(() => {
    if (!persona) navigate("/listaAgregados", { replace: true });
  }, []);

  if (!persona) return null;

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
    setIsSubmitting(true);
    try {
      const updateData: Record<string, any> = {};
      if (form.nombre !== persona?.nombre) updateData.nombre = form.nombre;
      if (form.email !== (persona?.email ?? "")) updateData.email = form.email;
      if (form.telefono !== (persona?.telefono ?? "")) updateData.telefono = form.telefono;
      if (selectedFiles.length > 0) updateData.photos = selectedFiles;

      if (Object.keys(updateData).length === 0) {
        showCustomToast("Atención", "Debes actualizar algún dato para guardar los cambios.", "info");
        setIsSubmitting(false);
        return;
      }

      await agregadosService.updatePerson(persona?.cedula!, updateData);
      showCustomToast("Éxito", "Persona actualizada correctamente.", "success");
      navigate("/listaAgregados");
    } catch (err: any) {
      if (err?.response?.status === 400) {
        showCustomToast("Atención", "Debes actualizar algún dato para guardar los cambios.", "info");
      } else {
        console.error("Error al actualizar:", err);
        setError("Error al actualizar la persona. Intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const remaining = 5 - selectedFiles.length;

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
         {/* ── Header ── */}
    
       <div className="flex flex-col sm:flex-row sm:items-start  gap-4 ml-1">
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl font-bold text-slate-900 leading-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Editar Persona
          </h1>
       
            <p
              className="text-sm text-slate-500 mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              En esta sección puedes editar la información de una persona registrada, así como actualizar sus fotos biométricas.
            </p>
       
        </div>

        
      </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

            {/* ── Datos personales ── */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-[3px] h-4 rounded-full bg-[#262c3e] flex-shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Datos personales
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Field label="Cédula" icon={Hash} name="cedula" value={form.cedula} onChange={handleChange} disabled />
                <Field label="Nombre completo" icon={User} name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez" disabled={isSubmitting} />
                <Field label="Correo electrónico" icon={Mail} name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" disabled={isSubmitting} />
                <Field label="Teléfono" icon={Phone} name="telefono" value={form.telefono} onChange={handleChange} placeholder="0987654321" disabled={isSubmitting} />
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* ── Fotos ── */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-[3px] h-4 rounded-full bg-[#262c3e] flex-shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Fotos biométricas
                </span>
                {selectedFiles.length > 0 && (
                  <div className="ml-auto flex items-center gap-1 rounded-lg px-2 py-0.5 bg-slate-100">
                    <span className="text-xs font-bold text-slate-600">{selectedFiles.length}</span>
                    <span className="text-xs text-slate-400">/5</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl overflow-hidden" style={{ background: "#262c3e" }}>

                {/* Desktop: horizontal */}
                <div className="hidden sm:flex items-stretch px-5 py-4">

                  {/* Foto actual */}
                  <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0" style={{ width: 160 }}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Foto actual
                    </p>
                    <button
                      type="button"
                      onClick={() => setLightboxSrc(persona.foto_url || noUser)}
                      className="cursor-zoom-in rounded-xl overflow-hidden border-2 transition hover:opacity-80"
                      style={{ borderColor: "rgba(255,255,255,0.12)", width: 90, height: 90 }}
                    >
                      <img
                        src={persona.foto_url || noUser}
                        alt={persona.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = noUser; }}
                      />
                    </button>
                    <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                      Clic para ver
                    </p>
                  </div>

                  <div className="flex-shrink-0 w-px mx-4 self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />

                  {/* Drop zone nuevas fotos */}
                  <div
                    onClick={() => remaining > 0 && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); if (remaining > 0) setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all select-none flex-shrink-0"
                    style={{
                      width: 150, minHeight: 130,
                      borderColor: isDragging ? "rgba(255,255,255,0.45)" : remaining === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.14)",
                      background: isDragging ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                      cursor: remaining === 0 ? "not-allowed" : "pointer",
                      opacity: remaining === 0 ? 0.45 : 1,
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: isDragging ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)" }}>
                      <Camera size={16} style={{ color: isDragging ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }} />
                    </div>
                    <div className="text-center px-2">
                      <p className="text-xs font-medium leading-snug" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {remaining === 0 ? "Límite" : isDragging ? "Suelta aquí" : "Nuevas fotos"}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.22)" }}>
                        {selectedFiles.length === 0 ? "Opcional" : `${selectedFiles.length} seleccionada${selectedFiles.length > 1 ? "s" : ""}`}
                      </p>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                  </div>

                  {/* Nuevas fotos grid horizontal */}
                  {previews.length > 0 && (
                    <>
                      <div className="flex-shrink-0 w-px mx-4 self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />
                      <div className="flex-1 min-w-0 flex items-center gap-2.5">
                        {previews.map((src, i) => (
                          <div key={i} className="relative group rounded-xl overflow-hidden flex-shrink-0 cursor-zoom-in"
                            style={{ width: 100, height: 100, background: "rgba(255,255,255,0.05)" }}
                            onClick={() => setLightboxSrc(src)}>
                            <img src={src} alt={`Nueva ${i + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold rounded px-1 py-0.5"
                              style={{ color: "rgba(255,255,255,0.8)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
                              {i + 1}
                            </span>
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
                            style={{ width: 100, height: 100, borderColor: "rgba(255,255,255,0.10)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)")}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)")}>
                            <ImagePlus size={14} style={{ color: "rgba(255,255,255,0.2)" }} className="group-hover:!text-white/40 transition" />
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>Añadir</span>
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Móvil: columnas */}
                <div className="flex sm:hidden flex-col gap-3 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setLightboxSrc(persona.foto_url || noUser)}
                      className="cursor-zoom-in rounded-xl overflow-hidden flex-shrink-0"
                      style={{ width: 56, height: 56, border: "2px solid rgba(255,255,255,0.12)" }}>
                      <img src={persona.foto_url || noUser} alt={persona.nombre} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = noUser; }} />
                    </button>
                    <div
                      onClick={() => remaining > 0 && fileInputRef.current?.click()}
                      className="flex-1 flex items-center gap-3 rounded-xl border-2 border-dashed px-3 py-2.5 transition-all select-none"
                      style={{
                        borderColor: "rgba(255,255,255,0.14)",
                        background: "rgba(255,255,255,0.03)",
                        cursor: remaining === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      <Camera size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>Nuevas fotos (opcional)</p>
                        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                          {selectedFiles.length === 0 ? "Toca para añadir" : `${selectedFiles.length} seleccionada${selectedFiles.length > 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {previews.map((src, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-square cursor-zoom-in"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                          onClick={() => setLightboxSrc(src)}>
                          <img src={src} alt={`Nueva ${i + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
                          <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                            style={{ background: "rgba(239,68,68,0.9)" }}>
                            <X size={10} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* ── Acciones ── */}
            <div className="px-6 py-4 bg-slate-50/60 flex items-center justify-between gap-4">
              {error ? (
                <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex-1 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                  <span className="truncate">{error}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} foto${selectedFiles.length > 1 ? "s" : ""} nueva${selectedFiles.length > 1 ? "s" : ""} adjunta${selectedFiles.length > 1 ? "s" : ""}`
                    : "Sin fotos nuevas — se mantienen las actuales"}
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
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Actualizando...</>
                  ) : (
                    <><UserPen size={13} />Actualizar</>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>

      <ImageModal isOpen={!!lightboxSrc} imageUrl={lightboxSrc} onClose={() => setLightboxSrc(null)} alt="Vista ampliada" />
      <CustomToaster />
    </div>
  );
}
