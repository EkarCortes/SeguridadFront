import { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Modal from "../../components/Modal";
import { useVerifications } from "../../hooks/useVerifications";
import { type Verificacion } from "../../service/ingresados/ingresadosService";

// Usar la interfaz directamente ya que tiene ID
interface ExtendedVerificacion extends Verificacion {}

const columns = (handleSelectPhoto: (row: ExtendedVerificacion) => void): TableProps<ExtendedVerificacion>["columns"] => [
  {
    name: "Foto",
    selector: (row) => row.image_source,
    cell: (row) => (
      <button
        className="group relative focus:outline-none"
        onClick={() => handleSelectPhoto(row)}
        title="Ver foto"
        style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
        type="button"
      >
        <img
          src={row.image_source || "https://via.placeholder.com/40"}
          alt={row.person_label ?? "Desconocido"}
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
    width: "80px",
    sortable: false,
  },
  {
    name: "Nombre",
    selector: (row) => row.person_label ?? "Desconocido",
    sortable: true,
      cell: (row) => (
          <span className="font-semibold text-white">
          {row.person_label ?? "Desconocido"}
          </span>
        ),
  },
  {
    name: "Fecha",
    selector: (row) => row.timestamp,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-200">
        {row.timestamp ? new Date(row.timestamp).toLocaleDateString('es-ES') : 'N/A'}
      </span>
    ),
    
  },
  {
    name: "Hora",
    selector: (row) => row.timestamp,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-200">
        {row.timestamp ? new Date(row.timestamp).toLocaleTimeString('es-ES') : 'N/A'}
      </span>
    ),
  },
  {
    name: "Acceso",
    selector: (row) => row.authorized,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-3 py-1 text-xs font-bold ${
          row.authorized
            ? "bg-green-700 text-green-100"
            : "bg-red-900 text-red-200"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {row.authorized ? "Autorizado" : "Denegado"}
      </span>
    ),
  },
  {
    name: "Caras Detectadas",
    selector: (row) => row.faces_detected,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-300">{row.faces_detected}</span>
    ),
    width: "150px",
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
  user: ExtendedVerificacion | null;
}) {
  return (
    <Modal open={open} onClose={onClose} size="md" title="Foto de verificación">
      <div className="flex flex-col items-center gap-4">
        {user?.image_source && (
          <img
            src={user.image_source}
            alt={user.person_label ?? "Desconocido"}
            className="w-64 h-64 rounded-xl object-cover border-2 border-[#303036] shadow-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/256";
            }}
          />
        )}
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold">{user?.person_label}</h3>
         
          <p className="text-neutral-400 text-sm">
            {user?.timestamp && `${new Date(user.timestamp).toLocaleString('es-ES')}`}
          </p>
          <p className="text-neutral-400 text-sm">
            Caras detectadas: {user?.faces_detected}
          </p>
          <p className="text-neutral-400 text-sm">
            Estado: {user?.authorized ? "Autorizado" : "Denegado"}
          </p>
        </div>
      </div>
    </Modal>
  );
}

export default function ListaIngresados() {
  const { verifications, totalVerificaciones, loading, error, refetch } = useVerifications();
  const [photoUser, setPhotoUser] = useState<ExtendedVerificacion | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const rowsPerPage = 10;

  
  const extendedVerifications: ExtendedVerificacion[] = verifications || [];

  function handleSelectPhoto(user: ExtendedVerificacion) {
    setPhotoUser(user);
  }

  // Función para manejar el cambio en el campo de búsqueda
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setCurrentPage(1); // Resetear a la primera página cuando se filtra
  }

  // Filtrado por búsqueda (nombre, ID, fecha) - corregir para manejar valores null
  const filteredIngresados = extendedVerifications.filter((i) => {
    const searchableText = [
      i.person_label ?? "Desconocido", // Usar "Desconocido" si person_label es null
      i.id.toString(),
      new Date(i.timestamp).toLocaleDateString('es-ES')
    ]
      .join(" ")
      .toLowerCase();
    
    return searchableText.includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-white text-lg">Cargando verificaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white mb-2">Lista de Verificaciones</h2>
          <div className="text-neutral-400 text-sm">
            Total: {totalVerificaciones} verificacion{totalVerificaciones !== 1 ? 'es' : ''}
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Buscar por nombre, ID o fecha..."
            value={search}
            onChange={handleSearchChange} // Usar la nueva función
            className="rounded bg-[#18181b] text-white px-3 py-2 w-80 border border-[#303036] focus:outline-none focus:ring-2 focus:ring-blue-700"
            style={{ minWidth: 0 }}
          />
          <button
            className="flex items-center gap-2 px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-600 transition"
            onClick={refetch}
            title="Actualizar datos"
            type="button"
          >
            Actualizar
          </button>
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
              No hay registros de verificaciones.
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