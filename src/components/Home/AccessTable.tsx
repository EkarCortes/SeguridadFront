import  { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import { useDailyVerifications } from "../../hooks/home/useDailyVerifications";
import { type DetalleIntento } from "../../service/home/homeService";
import LoadingSpinner from "../Spinner";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import image from "../../assets/noUser.jpg";
import PersonaPhotoModal from "../ModalPhoto"; // Importa el modal
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const accentColor = "#1f364a";
const mutedText = "#a3a3a3";
const selectedBg = "#e5e7eb";
const paperColor = "#fff";

// Función para convertir UTC a zona horaria de Costa Rica (UTC-6)

const transformDataForTable = (data: any) => {
  if (!data?.actividad_por_persona) return [];
  const tableData: any[] = [];
  data.actividad_por_persona.forEach((persona: any) => {
    persona.detalle_intentos.forEach((intento: DetalleIntento) => {
      const { fechaFormatted, horaFormatted, localDate } = convertToCostaRicaTime(intento.timestamp);
      tableData.push({
        id: intento.id,
        nombre: persona.nombre,
        fecha: fechaFormatted,
        hora: horaFormatted,
        acceso: intento.authorized ? "Permitido" : "Denegado",
        imagen: intento.image_source || persona.foto_perfil_url || image,
        timestamp: intento.timestamp,
        localTimestamp: localDate.getTime(),
        faces_detected: intento.faces_detected ?? null,
      });
    });
  });
  return tableData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

interface AccessRow {
  id: string | number;
  nombre: string;
  fecha: string;
  hora: string;
  acceso: "Permitido" | "Denegado";
  imagen: string;
  timestamp: string;
  localTimestamp: number;
  faces_detected?: number | null;
}

const getColumns = (
  handleSelectPhoto: (row: AccessRow) => void
): TableProps<AccessRow>["columns"] => [
  {
    name: "Foto",
    selector: (row) => row.imagen,
    cell: (row) => (
      <button
        className="group relative focus:outline-none"
        onClick={() => handleSelectPhoto(row)}
        title="Ver foto"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          margin: 0,
          cursor: "pointer",
          position: "relative",
        }}
        type="button"
      >
        <img
          src={row.imagen || image}
            alt={row.nombre ?? "Desconocido"}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#ccc] group-hover:opacity-70 transition"
          onError={(e) => {
            (e.target as HTMLImageElement).src = image;
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
    selector: (row) => row.nombre,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold" style={{ color: accentColor }}>
        {row.nombre}
      </span>
    ),
  },
  {
    name: "Fecha",
    selector: (row) => row.fecha,
    sortable: true,
    cell: (row) => <span style={{ color: accentColor }}>{row.fecha}</span>,
  },
  {
    name: "Hora",
    selector: (row) => row.hora,
    sortable: true,
    cell: (row) => <span style={{ color: accentColor }}>{row.hora}</span>,
  },
  {
    name: "Acceso",
    selector: (row) => row.acceso,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-3 py-1 text-xs font-bold ${
          row.acceso === "Permitido"
            ? "bg-[#6FBF73] text-green-100"
            : "bg-[#B85C5C] text-red-100"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {row.acceso}
      </span>
    ),
    center: true,
  },
];

const customStyles: TableProps<any>["customStyles"] = {
  table: {
    style: {
      backgroundColor: paperColor,
      color: accentColor,
      borderRadius: 10,
      fontFamily: "inherit",
    },
  },
  headRow: {
    style: {
      background: "#f3f6fa",
      color: accentColor,
      fontWeight: 600,
      fontSize: 15,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottom: `1px solid ${selectedBg}`,
      minHeight: "40px",
    },
  },
  headCells: {
    style: {
      color: accentColor,
      fontWeight: 500,
      fontSize: 14,
      letterSpacing: 0.2,
      background: "transparent",
    },
  },
  rows: {
    style: {
      backgroundColor: "#fff",
      color: accentColor,
      fontSize: "0.95rem",
      borderBottom: "1px solid #f3f6fa",
      '&:nth-of-type(odd)': {
        backgroundColor: "#f9faff",
      },
      '&:hover': {
        backgroundColor: "#e5e7eb",
      },
    },
    highlightOnHoverStyle: {
      backgroundColor: "#e0e7ef",
      color: accentColor,
      cursor: "pointer",
      outline: "none",
    },
  },
  pagination: {
    style: {
      backgroundColor: paperColor,
      color: mutedText,
      borderTop: `1px solid ${selectedBg}`,
      minHeight: "48px",
    },
  },
};

const AccessTable = () => {
  const { data, loading, error } = useDailyVerifications();
  const tableData = data ? transformDataForTable(data) : [];

  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);

  // Solo el handler de la foto
  const handleSelectPhoto = (row: any) => {
    setSelectedRow(row);
    setModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner message="Cargando registros de acceso" size="md" />;
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-6" style={{ color: accentColor }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold" style={{ color: accentColor }}>
            Registros de acceso diario
          </h2>
          <div className="text-sm" style={{ color: accentColor }}>
            Total: {tableData.length} {tableData.length !== 1 ? "elementos" : "elemento"}
          </div>
        </div>
        <div className="rounded-lg shadow-lg bg-white p-2">
          <DataTable
            columns={getColumns(handleSelectPhoto)}
            data={tableData}
            customStyles={customStyles}
            pagination
            paginationPerPage={6}
            paginationRowsPerPageOptions={[6, 12, 18, 24]}
            highlightOnHover
            noDataComponent={
              <div className="py-6 text-center" style={{ color: accentColor }}>
                Sin registros
              </div>
            }
          />
        </div>
      </div>
      {/* Modal */}
      <PersonaPhotoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={
          selectedRow
            ? {
                image_source: selectedRow.imagen,
                person_label: selectedRow.nombre,
                ts: selectedRow.timestamp,
                faces_detected: selectedRow.faces_detected ?? null,
                authorized: selectedRow.acceso === "Permitido",
              }
            : null
        }
        type="ingresado"
      />
    </div>
  );
};

export default AccessTable;