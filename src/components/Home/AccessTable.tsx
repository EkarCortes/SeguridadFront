import DataTable, { type TableProps } from "react-data-table-component";
import { useDailyVerifications } from "../../hooks/home/useDailyVerifications";
import { type DetalleIntento } from "../../service/home/homeService";
import LoadingSpinner from "../Spinner";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import image from "../../assets/noUser.jpg";


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
      });
    });
  });
  return tableData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const columns: TableProps<any>["columns"] = [
  {
    name: "Foto",
    selector: (row: any) => row.imagen,
    cell: (row: any) => (
      <img
        src={row.imagen}
        alt={row.nombre}
        className="w-10 h-10 rounded-full object-cover border-2 border-[#ccc]"
        onError={(e: any) => {
          e.target.src = image;
        }}
      />
    ),
    width: "80px",
    sortable: false,
  },
  {
    name: "Nombre",
    selector: (row: any) => row.nombre,
    sortable: true,
    cell: (row: any) => (
      <span className="font-semibold" style={{ color: accentColor }}>
        {row.nombre}
      </span>
    ),
  },
  {
    name: "Fecha",
    selector: (row: any) => row.fecha,
    sortable: true,
    cell: (row: any) => (
      <span style={{ color: accentColor }}>{row.fecha}</span>
    ),
  },
  {
    name: "Hora",
    selector: (row: any) => row.hora,
    sortable: true,
    cell: (row: any) => (
      <span style={{ color: accentColor }}>{row.hora}</span>
    ),
  },
  {
    name: "Acceso",
    selector: (row: any) => row.acceso,
    sortable: true,
    cell: (row: any) => (
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
            columns={columns}
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
    </div>
  );
};

export default AccessTable;