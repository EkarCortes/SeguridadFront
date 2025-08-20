import React, { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Modal from "../../components/Modal";

// Ejemplo de datos de ingresados
const initialIngresados = [
  {
    id: 1,
    nombre: "Juan Pérez",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
    fecha: "2025-08-19",
    hora: "08:30",
    acceso: "Permitido",
  },
  {
    id: 2,
    nombre: "Ana Gómez",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    fecha: "2025-08-19",
    hora: "09:10",
    acceso: "Denegado",
  },
  // ...más ingresados
];

const columns = (handleSelectPhoto: (row: any) => void): TableProps<any>["columns"] => [
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
    name: "Fecha",
    selector: (row) => row.fecha,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-200">{row.fecha}</span>
    ),
  },
  {
    name: "Hora",
    selector: (row) => row.hora,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-200">{row.hora}</span>
    ),
  },
  {
    name: "Acceso",
    selector: (row) => row.acceso,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-3 py-1 text-xs font-bold ${
          row.acceso === "Permitido"
            ? "bg-green-700 text-green-100"
            : "bg-red-900 text-red-200"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {row.acceso}
      </span>
    ),
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

export default function ListaIngresados() {
  const [ingresados] = useState(initialIngresados);
  const [photoUser, setPhotoUser] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // Estado para el buscador
  const rowsPerPage = 10;

  function handleSelectPhoto(user: any) {
    setPhotoUser(user);
  }

  // Filtrado por búsqueda (nombre, fecha, hora, acceso)
  const filteredIngresados = ingresados.filter((i) =>
    [i.nombre, i.fecha, i.hora, i.acceso]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-[400px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        <h2 className="text-2xl font-bold text-white mb-2">Lista de Ingresados</h2>
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded bg-[#18181b] text-white px-3 py-2 w-80 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            style={{ minWidth: 0 }}
          />
        </div>
        <DataTable
          columns={columns(handleSelectPhoto)}
          data={filteredIngresados}
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
              No hay registros de ingresos.
            </div>
          }
        />
      </div>
      {/* Modal ver foto */}
      <PhotoModal
        open={!!photoUser}
        onClose={() => setPhotoUser(null)}
        user={photoUser}
      />
    </div>
  );
}