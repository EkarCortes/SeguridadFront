import { useState } from "react";
import FormField from "../Ui/FormField";
import FileUpload from "../Ui/FileUpload";
import { useFileUpload } from "../../hooks/agregados/useFileUpload";
import type { PersonFormData } from "../../types/agregados";


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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <FormField
          label="Nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full"
        />
        <FormField
          label="Cédula"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          required
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
          required
          className="w-full"
        />
        <FormField
          label="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          required
          className="w-full"
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

      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 w-full">
        <button
          type="button"
          className="px-2 py-1 rounded bg-neutral-600 text-white hover:bg-neutral-500 transition w-full text-lg font-semibold"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-2 py-2 rounded bg-[#6FBF73] text-white hover:bg-[#58985C] transition w-full text-lg font-semibold"
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