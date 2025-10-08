import { useState } from "react";
import FormField from "../FormField";
import FileUpload from "../FileUpload";
import { useFileUpload } from "../../hooks/useFileUpload";
import { type ExtendedPersona } from "../table/personasColumns";
import api from "../../config/apiconfig";
import image from "../../assets/noUser.jpg";

// Este componente se utiliza para editar la información de una persona existente, permitiendo modificar campos como cédula, email, teléfono y cargar nuevas fotos.

interface EditFormProps {
  initial: ExtendedPersona;
  onSave: (data: ExtendedPersona, updateData: any) => void;
  onCancel: () => void;
}

export default function EditForm({ initial, onSave, onCancel }: EditFormProps) {
  const [form, setForm] = useState({
    nombre: initial.nombre,
    cedula: initial.cedula || '',
    email: initial.email || '',
    telefono: initial.telefono || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedFiles, previews, handleFileChange, removeFile } = useFileUpload(5);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        cedula: form.cedula !== initial.cedula ? form.cedula : undefined,
        email: form.email !== initial.email ? form.email : undefined,
        telefono: form.telefono !== initial.telefono ? form.telefono : undefined,
        fotos_nuevas: selectedFiles.length > 0 ? selectedFiles : undefined,
      };

      // Filtrar campos undefined
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      await onSave({ ...initial, ...form }, filteredUpdateData);
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <FormField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled
          helperText="El nombre no se puede modificar"
          className="w-full"
        />
        <FormField
          label="Cédula"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-2 w-full">
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          className="w-full"
        />
        <FormField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-neutral-200 text-sm mb-1">
          Foto actual
        </label>
        <div className="mb-3">
          {initial.foto_url && (
            <img
              src={`${api}/${initial.foto_url.replace(/^\/+/, "")}`}
              alt={initial.nombre}
              className="w-20 h-20 rounded-lg object-cover border-2 border-[#303036]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = image;
              }}
            />
          )}
        </div>

        <FileUpload
          label="Nuevas fotos (opcional)"
          selectedFiles={selectedFiles}
          previews={previews}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          helperText="Selecciona hasta 5 fotos nuevas para reemplazar las actuales. Si no seleccionas ninguna, se mantienen las fotos actuales."
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 w-full">
        <button
          type="button"
          className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-500 transition w-full sm:w-auto"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Actualizando...
            </>
          ) : (
            'Actualizar'
          )}
        </button>
      </div>
    </form>
  );
}