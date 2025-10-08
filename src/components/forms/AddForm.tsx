import { useState } from "react";
import FormField from "../FormField";
import FileUpload from "../FileUpload";
import { useFileUpload } from "../../hooks/useFileUpload";
import { type PersonFormData } from "../../service/agregados/agregadosService";

//Este componente se utiliza para registrar una nueva persona, incluye campos para nombre, cédula, email, teléfono y carga de fotos.

interface AddFormProps {
  onSave: (data: PersonFormData) => void;
  onCancel: () => void;
}

export default function AddForm({ onSave, onCancel }: AddFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
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

    if (selectedFiles.length === 0) {
      alert('Debe seleccionar al menos una foto');
      return;
    }

    setIsSubmitting(true);

    try {
      const personData: PersonFormData = {
        ...form,
        fotos: selectedFiles,
      };

      await onSave(personData);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <FormField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <FormField
          label="Cédula"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex gap-2">
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
        />
        <FormField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          required
        />
      </div>

      <FileUpload
        label="Fotos"
        selectedFiles={selectedFiles}
        previews={previews}
        onFileChange={handleFileChange}
        onRemoveFile={removeFile}
        required
        helperText="Selecciona entre 1 y 5 fotos. Formatos soportados: JPG, PNG, etc."
      />

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-500 transition"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Registrando...
            </>
          ) : (
            'Registrar'
          )}
        </button>
      </div>
    </form>
  );
}