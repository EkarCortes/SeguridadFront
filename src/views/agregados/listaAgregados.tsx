import React, { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../components/Modal";
import { usePersons } from "../../hooks/usePersons";
import { agregadosService, type Persona, type PersonFormData } from "../../service/agregados/agregadosService";

// Extender la interfaz Persona para incluir campos adicionales del formulario
interface ExtendedPersona extends Persona {
  id?: number;
  cedula?: string;
  email?: string;
  telefono?: string;
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
          ? `http://20.3.129.141:8001/${row.foto_url.replace(/^\/+/, "")}`
          : "https://via.placeholder.com/40"
          }
          alt={row.nombre}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#303036] group-hover:opacity-70 transition"
          onError={(e) => {
        (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
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
  },
  {
    name: "Email",
    selector: (row) => row.email || 'N/A',
    sortable: true,
  },
  {
    name: "Teléfono",
    selector: (row) => row.telefono || 'N/A',
    sortable: false,
  },
   {
    name: "Primer Acceso",
    selector: (row) => row.primer_acceso,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-300">
        {row.primer_acceso ? new Date(row.primer_acceso).toLocaleDateString('es-ES') : 'N/A'}
      </span>
    ),
  },
  {
    name: "Último Acceso",
    selector: (row) => row.ultimo_acceso,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-300">
        {row.ultimo_acceso ? new Date(row.ultimo_acceso).toLocaleDateString('es-ES') : 'N/A'}
      </span>
    ),
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
  onSave: (data: ExtendedPersona) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...initial });
  const [preview, setPreview] = useState(form.foto_url || "");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked, files } = e.target as any;
    if (name === "foto_url" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setForm((f) => ({
          ...f,
          foto_url: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((f) => ({
        ...f,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Nombre</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="nombre"
            value={form.nombre || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Cédula</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="cedula"
            value={form.cedula || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Email</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            type="email"
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Teléfono</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="telefono"
            value={form.telefono || ""}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-neutral-400 text-sm mb-1">Foto (subir imagen)</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            name="foto_url"
            accept="image/*"
            onChange={handleChange}
            className="w-auto rounded bg-[#18181b] text-white px-3 py-2"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-16 h-16 rounded-lg object-cover border-2 border-[#303036]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/64";
              }}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          className="px-4 py-2 rounded bg-neutral-600 text-white hover:bg-neutral-500"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-700 text-white hover:bg-blue-600"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}

function PhotoModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: ExtendedPersona | null;
}) {
  return (
    <Modal open={open} onClose={onClose} size="md" title="Foto de usuario">
      <div className="flex flex-col items-center gap-4">
      {user?.foto_url && (
        <img
        src={
          user.foto_url
          ? `http://20.3.129.141:8001/${user.foto_url.replace(/^\/+/, "")}`
          : "https://via.placeholder.com/256"
        }
        alt={user.nombre}
        className="w-64 h-64 rounded-xl object-cover border-2 border-[#303036] shadow-lg"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://via.placeholder.com/256";
        }}
        />
      )}
      <div className="text-center text-white">
        <h3 className="text-lg font-semibold">{user?.nombre}</h3>
        {user?.ultimo_acceso && (
        <p className="text-neutral-400 text-sm">
          Último acceso: {new Date(user.ultimo_acceso).toLocaleString('es-ES')}
        </p>
        )}
      </div>
      </div>
    </Modal>
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
    cedula: "",
    email: "",
    telefono: "",
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

  function handleSaveEdit(data: ExtendedPersona) {
    // Aquí deberías hacer una llamada a la API para actualizar
    console.log("Guardar edición:", data);
    setEditUser(null);
    refetch(); // Recargar datos
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
    return (
      <div className="w-full min-h-[600px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-white text-lg">Cargando personas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[600px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white mb-2">Lista de Personas</h2>
          <div className="text-neutral-400 text-sm">
            Total: {totalPersonas} persona{totalPersonas !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={handleSearchChange} // Usar la nueva función
            className="rounded bg-[#18181b] text-white px-3 py-2 w-80 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
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
        <DataTable
          columns={columns(handleEdit, handleDelete, handleSelectPhoto)}
          data={filteredAgregados}
          customStyles={customStyles}
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
            <div className="py-6 text-center text-neutral-400">
              No hay personas registradas.
            </div>
          }
        />
      </div>
      {/* Modal agregar - actualizado */}
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
      {/* Modal eliminar */}
      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} size="sm" title="Eliminar Persona">
        <div className="text-white mb-4">
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
      {/* Modal ver foto */}
      <PhotoModal
        open={!!photoUser}
        onClose={() => setPhotoUser(null)}
        user={photoUser}
      />
    </div>
  );
}