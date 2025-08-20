import React, { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AddIcon from "@mui/icons-material/Add";
import Modal from "../../components/Modal"; // Asegúrate de crear este archivo

// Ejemplo de datos de agregados
const initialAgregados = [
  {
    id: 1,
    nombre: "Juan Pérez",
    cedula: "12345678",
    email: "juan.perez@email.com",
    activo: true,
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    telefono: "555-1234",
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    cedula: "87654321",
    email: "ana.gomez@email.com",
    activo: false,
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    telefono: "555-5678",
  },

];

const columns = (
  handleEdit: (row: any) => void,
  handleDelete: (row: any) => void,
  handleSelectPhoto: (row: any) => void
): TableProps<any>["columns"] => [
  {
    name: "Foto",
    selector: (row) => row.foto,
    cell: (row) => (
      <button
        className="group relative focus:outline-none"
        onClick={() => handleSelectPhoto(row)}
        title="Ver foto"
        style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
        type="button"
      >
        <img
          src={row.foto}
          alt={row.nombre}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#303036] group-hover:opacity-70 transition"
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
    selector: (row) => row.cedula,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Teléfono",
    selector: (row) => row.telefono,
    sortable: false,
  },
  {
    name: "Activo",
    selector: (row) => row.activo,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-3 py-1 text-xs font-bold ${
          row.activo ? "bg-green-700 text-green-100" : "bg-red-900 text-red-200"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {row.activo ? "Sí" : "No"}
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
  initial: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...initial });
  const [preview, setPreview] = useState(form.foto);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked, files } = e.target as any;
    if (name === "foto" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setForm((f: typeof form) => ({
          ...f,
          foto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((f: typeof form) => ({
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
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Cédula</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="cedula"
            value={form.cedula}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Email</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            type="email"
          />
        </div>
        <div className="flex-1">
          <label className="block text-neutral-400 text-sm mb-1">Teléfono</label>
          <input
            className="w-full rounded bg-[#18181b] text-white px-3 py-2"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            id="activo"
          />
          <label htmlFor="activo" className="text-neutral-400 text-sm">
            Activo
          </label>
        </div>
      </div>
      <div>
        <label className="block text-neutral-400 text-sm mb-1">Foto (subir imagen)</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-auto rounded bg-[#18181b] text-white px-3 py-2"

          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-16 h-16 rounded-lg object-cover border-2 border-[#303036]"
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

// Modal para mostrar la foto en grande
function PhotoModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  return (
    <Modal open={open} onClose={onClose} size="md" title="Foto de usuario">
      <div className="flex flex-col items-center gap-4">
        {user?.foto && (
          <img
            src={user.foto}
            alt={user.nombre}
            className="w-64 h-64 rounded-xl object-cover border-2 border-[#303036] shadow-lg"
          />
        )}
      
      </div>
    </Modal>
  );
}

export default function ListaAgregados() {
  const [agregados, setAgregados] = useState(initialAgregados);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [deleteUser, setDeleteUser] = useState<any | null>(null);
  const [photoUser, setPhotoUser] = useState<any | null>(null);
  const [addModal, setAddModal] = useState(false); // Nuevo estado para modal de agregar
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 5;

  // Filtrado por búsqueda
  const filteredAgregados = agregados.filter((a) =>
    [a.nombre, a.cedula, a.email, a.telefono]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Editar usuario
  function handleEdit(user: any) {
    setEditUser(user);
  }

  function handleSaveEdit(data: any) {
    setAgregados((prev) =>
      prev.map((a) => (a.id === data.id ? { ...a, ...data } : a))
    );
    setEditUser(null);
  }

  // Eliminar usuario
  function handleDelete(user: any) {
    setDeleteUser(user);
  }

  function confirmDelete() {
    setAgregados((prev) => prev.filter((a) => a.id !== deleteUser.id));
    setDeleteUser(null);
  }

  // Ver foto en grande
  function handleSelectPhoto(user: any) {
    setPhotoUser(user);
  }

  // Agregar usuario
  function handleAddUser(data: any) {
    setAgregados((prev) => [
      ...prev,
      { ...data, id: prev.length ? Math.max(...prev.map(a => a.id)) + 1 : 1 },
    ]);
    setAddModal(false);
  }

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-bold text-white mb-2">Lista de Agregados</h2>
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              No hay agregados registrados.
            </div>
          }
        />
      </div>
      {/* Modal agregar */}
      <Modal open={addModal} onClose={() => setAddModal(false)} size="md" title="Agregar Agregado">
        <EditForm
          initial={{
            nombre: "",
            cedula: "",
            email: "",
            telefono: "",
            activo: true,
            foto: "",
          }}
          onSave={handleAddUser}
          onCancel={() => setAddModal(false)}
        />
      </Modal>
      {/* Modal editar */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} size="md" title="Editar Agregado">
        {editUser && (
          <EditForm
            initial={editUser}
            onSave={handleSaveEdit}
            onCancel={() => setEditUser(null)}
          />
        )}
      </Modal>
      {/* Modal eliminar */}
      <Modal open={!!deleteUser} onClose={() => setDeleteUser(null)} size="sm" title="Eliminar Agregado">
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
