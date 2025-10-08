import React, { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AddIcon from "@mui/icons-material/Add";
import { usePersons } from "../../hooks/usePersons";
import LoadingSpinner from "../../components/Spinner";
import PersonaPhotoModal from "../../components/ModalPhoto";
import Modal from "../../components/Modal";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import api from "../../config/apiconfig";
//eLIMINAR
import { agregadosService, type Persona, type PersonFormData } from "../../service/agregados/agregadosService";



// Extender la interfaz Persona para incluir un ID local
interface ExtendedPersona extends Persona {
  id?: number;
}

const columns = (
  handleEdit: (row: ExtendedPersona) => void,
  handleDelete: (row: ExtendedPersona) => void,
  handleSelectPhoto: (row: ExtendedPersona) => void
): TableProps<ExtendedPersona>["columns"] => [
    {
      name: "Foto",
      selector: (row) => row.foto_url,
      cell: (row) => (
        <button
          className="group relative focus:outline-none"
          onClick={() => handleSelectPhoto(row)}
          title="Ver foto"
          style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          type="button"
        >
          <img
            src={
              row.foto_url
                ? `${api}/${row.foto_url.replace(/^\/+/, "")}`
                : "https://www.pngfind.com/pngs/m/93-938050_png-file-transparent-white-user-icon-png-download.png"
            }
            alt={row.nombre}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#303036] group-hover:opacity-70 transition"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://gimgs2.nohat.cc/thumb/f/640/person-icons-person-icon--m2i8m2A0K9H7N4m2.jpg";
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PhotoCameraIcon className="text-white bg-black/60 rounded-full p-1" fontSize="small" />
          </span>
        </button>
      ),
      width: "70px",
      sortable: false,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      cell: (row) => <span className="font-semibold text-white">{row.nombre}</span>,
    },
    {
      name: "Cédula",
      selector: (row) => row.cedula || 'N/A',
      sortable: true,
      cell: (row) => (
        <span className="text-neutral-200">{row.cedula || 'N/A'}</span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email || 'N/A',
      sortable: true,
      cell: (row) => (
        <span className="text-neutral-200">{row.email || 'N/A'}</span>
      ),
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono || 'N/A',
      sortable: false,
      cell: (row) => (
        <span className="text-neutral-200">{row.telefono || 'N/A'}</span>
      ),
    },


    {
      name: "Primer Acceso",
      selector: (row) => row.primer_acceso || '',
      sortable: true,
      cell: (row) => (
        <span className="text-neutral-300">
          {row.primer_acceso ? convertToCostaRicaTime(row.primer_acceso).fechaFormatted : 'N/A'}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Último Acceso",
      selector: (row) => row.ultimo_acceso || '',
      sortable: true,
      cell: (row) => (
        <span className="text-neutral-300">
          {row.ultimo_acceso ? convertToCostaRicaTime(row.ultimo_acceso).fechaFormatted : 'N/A'}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Fecha Registro",
      selector: (row) => row.fecha_registro,
      sortable: true,
      cell: (row) => (
        <span className="text-neutral-300">
          {convertToCostaRicaTime(row.fecha_registro).fechaFormatted}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="p-1 rounded hover:bg-blue-700 transition"
            onClick={() => handleEdit(row)}
            title="Editar"
          >
            <EditIcon className="text-blue-400" fontSize="small" />
          </button>
          <button
            className="p-1 rounded hover:bg-red-700 transition"
            onClick={() => handleDelete(row)}
            title="Eliminar"
          >
            <DeleteIcon className="text-red-400" fontSize="small" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "90px",
    },
  ];

const customStyles = {
  table: {
    style: {
      background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
      borderRadius: "0.75rem",
      color: "#a3a3a3",
      minHeight: "400px",
    },
  },
  headRow: {
    style: {
      background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
      color: "#a3a3a3",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  headCells: {
    style: {
      color: "#a3a3a3",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  rows: {
    style: {
      backgroundColor: "#252730",
      color: "#fff",
      fontSize: "0.95rem",
      borderBottom: "1px solid #303036",
      '&:nth-of-type(odd)': {
        backgroundColor: "#2f313aff",
      },
      '&:hover': {
        backgroundColor: "#313136",
      },
    },
  },
  pagination: {
    style: {
      background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
      color: "#a3a3a3",
      borderBottomLeftRadius: "0.75rem",
      borderBottomRightRadius: "0.75rem",
    },
    pageButtonsStyle: {
      fill: "#fff",
      '&:disabled': {
        fill: "#a3a3a3",
      },
    },
  },
};

function EditForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: ExtendedPersona;
  onSave: (data: ExtendedPersona, updateData: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    nombre: initial.nombre,
    cedula: initial.cedula || '',
    email: initial.email || '',
    telefono: initial.telefono || '',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert('Máximo 5 fotos permitidas');
      return;
    }

    setSelectedFiles(files);

    // Crear previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">
            Nombre
          </label>
          <input
            className="w-full rounded bg-[#27272a] text-neutral-400 px-3 py-2 border border-[#303036] cursor-not-allowed"
            name="nombre"
            value={form.nombre}
            disabled
            title="El nombre no se puede editar"
          />
          <p className="text-xs text-neutral-500 mt-1">El nombre no se puede modificar</p>
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Cédula</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Email</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Teléfono</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-neutral-400 text-sm mb-1">
          Foto actual
        </label>
        <div className="mb-3">
          {initial.foto_url && (
            <img
              src={`http://20.3.129.141:8000/${initial.foto_url.replace(/^\/+/, "")}`}
              alt={initial.nombre}
              className="w-20 h-20 rounded-lg object-cover border-2 border-[#303036]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/80";
              }}
            />
          )}
        </div>

        <label className="block text-neutral-400 text-sm mb-1">
          Nuevas fotos (opcional)
        </label>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-700 file:text-white hover:file:bg-blue-600"
          />
          <p className="text-neutral-500 text-xs">
            Selecciona hasta 5 fotos nuevas para reemplazar las actuales. Si no seleccionas ninguna, se mantienen las fotos actuales.
          </p>

          {/* Preview de nuevas imágenes */}
          {previews.length > 0 && (
            <div>
              <p className="text-neutral-400 text-sm mb-2">Nuevas fotos seleccionadas:</p>
              <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Nueva foto ${index + 1}`}
                      className="w-full h-20 object-cover rounded border-2 border-[#303036]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 flex items-center justify-center"
                      title="Eliminar foto"
                    >
                      ×
                    </button>
                    <div className="text-center text-xs text-neutral-400 mt-1">
                      Nueva foto {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
          className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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


function AddForm({
  onSave,
  onCancel,
}: {
  onSave: (data: PersonFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    email: "",
    telefono: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert('Máximo 5 fotos permitidas');
      return;
    }

    setSelectedFiles(files);

    // Crear previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeFile(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
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
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">
            Cédula <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">
            Teléfono <span className="text-red-400">*</span>
          </label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-neutral-400 text-sm mb-1">
          Fotos <span className="text-red-400">*</span>
        </label>
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full rounded bg-[#18181b] text-white px-3 py-2 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-700 file:text-white hover:file:bg-blue-600"
          />
          <p className="text-neutral-500 text-xs">
            Selecciona entre 1 y 5 fotos. Formatos soportados: JPG, PNG, etc.
          </p>

          {/* Preview de imágenes seleccionadas */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {previews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded border-2 border-[#303036]"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 flex items-center justify-center"
                    title="Eliminar foto"
                  >
                    ×
                  </button>
                  <div className="text-center text-xs text-neutral-400 mt-1">
                    Foto {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

// Actualizar el componente principal
export default function ListaAgregados() {
  const { persons, totalPersonas, loading, error, refetch } = usePersons();
  const [editUser, setEditUser] = useState<ExtendedPersona | null>(null);
  const [deleteUser, setDeleteUser] = useState<ExtendedPersona | null>(null);
  const [photoUser, setPhotoUser] = useState<ExtendedPersona | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 5;

  // Convertir personas a formato extendido con IDs
  const extendedPersons: ExtendedPersona[] = persons.map((person, index) => ({
    ...person,
    id: index + 1,
  }));

  // Filtrado por búsqueda
  const filteredAgregados = extendedPersons.filter((a) =>
    [a.nombre, a.cedula, a.email, a.telefono]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Función para manejar el cambio en el campo de búsqueda
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se filtra
  }

  function handleEdit(user: ExtendedPersona) {
    setEditUser(user);
  }

  async function handleSaveEdit(data: ExtendedPersona, updateData: any) {
    try {
      await agregadosService.updatePerson(data.nombre, updateData);
      console.log("Usuario actualizado exitosamente:", data);
      setEditUser(null);
      refetch(); // Recargar datos
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      alert("Error al actualizar la persona. Por favor, intenta nuevamente.");
    }
  }

  function handleDelete(user: ExtendedPersona) {
    setDeleteUser(user);
  }

  function confirmDelete() {
    // Aquí deberías hacer una llamada a la API para eliminar
    console.log("Eliminar usuario:", deleteUser);
    setDeleteUser(null);
    refetch(); // Recargar datos
  }

  function handleSelectPhoto(user: ExtendedPersona) {
    setPhotoUser(user);
  }

  async function handleAddUser(data: PersonFormData) {
    try {
      await agregadosService.registerPerson(data);
      console.log("Usuario registrado exitosamente:", data);
      setAddModal(false);
      refetch(); // Recargar datos
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert("Error al registrar la persona. Por favor, intenta nuevamente.");
    }
  }

  if (loading) {
    return <LoadingSpinner message="Cargando personas registradas" size="lg" />;
  }

  if (error) {
    return (
      <div className="w-full min-h-[600px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-[#f9faff] rounded-xl shadow-2xl p-6 flex flex-col gap-6" style={{ color: "#1f364a" }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: "#1f364a" }}>
            Lista de Personas
          </h2>
          <div className="text-sm" style={{ color: "#1f364a" }}>
            Total: {totalPersonas} persona{totalPersonas !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, email o teléfono..."
            value={search}
            onChange={handleSearchChange}
            className="rounded bg-[#f3f6fa] text-[#1f364a] px-3 py-2 w-80 border border-[#dbeafe] focus:outline-none focus:ring-2 focus:ring-blue-700"
            style={{ minWidth: 0 }}
          />
          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-green-700 text-white hover:bg-green-600 transition"
            onClick={() => setAddModal(true)}
            title="Agregar nuevo"
            type="button"
          >
            <AddIcon fontSize="small" />
            Agregar
          </button>
        </div>
        <div className="rounded-lg shadow-lg bg-white p-2">
          <DataTable
            columns={columns(handleEdit, handleDelete, handleSelectPhoto)}
            data={filteredAgregados}
            customStyles={{
              ...customStyles,
              table: {
                style: {
                  background: "#fff",
                  borderRadius: "0.75rem",
                  color: "#1f364a",
                  minHeight: "400px",
                },
              },
              headRow: {
                style: {
                  background: "#f3f6fa",
                  color: "#1f364a",
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
              },
              headCells: {
                style: {
                  color: "#1f364a",
                  fontWeight: "bold",
                  fontSize: "1rem",
                },
              },
              rows: {
                style: {
                  backgroundColor: "#fff",
                  color: "#1f364a",
                  fontSize: "0.95rem",
                  borderBottom: "1px solid #e5e7eb",
                  '&:nth-of-type(odd)': {
                    backgroundColor: "#f3f6fa",
                  },
                  '&:hover': {
                    backgroundColor: "#e0e7ef",
                  },
                },
              },
              pagination: {
                style: {
                  background: "#f3f6fa",
                  color: "#1f364a",
                  borderBottomLeftRadius: "0.75rem",
                  borderBottomRightRadius: "0.75rem",
                },
                pageButtonsStyle: {
                  fill: "#1f364a",
                  '&:disabled': {
                    fill: "#a3a3a3",
                  },
                },
              },
            }}
            pagination
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[rowsPerPage]}
            paginationComponentOptions={{
              rowsPerPageText: "Filas por página",
              rangeSeparatorText: "de",
              noRowsPerPage: true,
              selectAllRowsItem: false,
            }}
            onChangePage={setCurrentPage}
            paginationDefaultPage={currentPage}
            noDataComponent={
              <div className="py-6 text-center" style={{ color: "#1f364a" }}>
                No hay personas registradas.
              </div>
            }
          />
        </div>
        {/* Modal agregar */}
        <Modal open={addModal} onClose={() => setAddModal(false)} size="lg" title="Registrar Nueva Persona">
          <AddForm
            onSave={handleAddUser}
            onCancel={() => setAddModal(false)}
          />
        </Modal>
        {/* Modal editar */}
        <Modal open={!!editUser} onClose={() => setEditUser(null)} size="md" title="Editar Persona">
          {editUser && (
            <EditForm
              initial={editUser}
              onSave={handleSaveEdit}
              onCancel={() => setEditUser(null)}
            />
          )}
        </Modal>
        <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} size="sm" title="Eliminar Persona">
          <div className="mb-4" style={{ color: "#1f364a" }}>
            ¿Seguro que deseas eliminar a <span className="font-bold">{deleteUser?.nombre}</span>?
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-500"
              onClick={() => setDeleteUser(null)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-600"
              onClick={confirmDelete}
            >
              Eliminar
            </button>
          </div>
        </Modal>
        <PersonaPhotoModal
          open={!!photoUser}
          onClose={() => setPhotoUser(null)}
          user={photoUser}
        />
      </div>
    </div>
  );
}