import { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Modal from "../../components/Modal";

import { useVerifications } from "../../hooks/useVerifications";
import { type Verificacion } from "../../service/ingresados/ingresadosService";
import LoadingSpinner from "../../components/Spinner";

// Usar la interfaz directamente ya que tiene ID
interface ExtendedVerificacion extends Verificacion {}

// Función para convertir UTC a zona horaria de Costa Rica (UTC-6)
const convertToCostaRicaTime = (utcTimestamp: string) => {
  const utcDate = new Date(utcTimestamp);
  
  // Costa Rica está en UTC-6 (CST) todo el año
  const costaRicaOffset = -6 * 60; // -6 horas en minutos
  const costaRicaTime = new Date(utcDate.getTime() + (costaRicaOffset * 60 * 1000));
  
  const fechaFormatted = costaRicaTime.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const horaFormatted = costaRicaTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  

  return { fechaFormatted, horaFormatted, localDate: costaRicaTime };
};

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
          src={row.image_source || "https://gimgs2.nohat.cc/thumb/f/640/person-icons-person-icon--m2i8m2A0K9H7N4m2.jpg"}
          alt={row.person_label ?? "Desconocido"}
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
        {row.timestamp ? convertToCostaRicaTime(row.timestamp).fechaFormatted : 'N/A'}
      </span>
    ),
    
  },
  {
    name: "Hora",
    selector: (row) => row.timestamp,
    sortable: true,
    cell: (row) => (
      <span className="text-neutral-200">
        {row.timestamp ? convertToCostaRicaTime(row.timestamp).horaFormatted : 'N/A'}
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
              (e.target as HTMLImageElement).src = "https://gimgs2.nohat.cc/thumb/f/640/person-icons-person-icon--m2i8m2A0K9H7N4m2.jpg";
            }}
          />
        )}
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold">{user?.person_label}</h3>
         
          <p className="text-neutral-400 text-sm">
            {user?.timestamp && `${convertToCostaRicaTime(user.timestamp).fechaFormatted} ${convertToCostaRicaTime(user.timestamp).horaFormatted}`}
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
      i.timestamp ? convertToCostaRicaTime(i.timestamp).fechaFormatted : ''
    ]
      .join(" ")
      .toLowerCase();
    
    return searchableText.includes(search.toLowerCase());
  });

  if (loading) {
    return <LoadingSpinner message="Cargando verificaciones" size="lg" />;
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
      <div
        className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-6"
        style={{ color: "#1f364a" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: "#1f364a" }}>
            Lista de Verificaciones
          </h2>
          <div className="text-sm" style={{ color: "#1f364a" }}>
            Total: {totalVerificaciones} verificacion{totalVerificaciones !== 1 ? 'es' : ''}
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder="Buscar por nombre, ID o fecha..."
            value={search}
            onChange={handleSearchChange}
            className="rounded bg-[#f3f6fa] text-[#1f364a] px-3 py-2 w-80 border border-[#dbeafe] focus:outline-none focus:ring-2 focus:ring-blue-700"
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
        <div className="rounded-lg shadow-lg bg-white p-2">
          <DataTable
            columns={columns(handleSelectPhoto)}
            data={filteredIngresados}
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
    </div>
  );
}