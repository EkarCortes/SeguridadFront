import DataTable, { type TableProps } from "react-data-table-component";
import { useDailyVerifications } from "../hooks/useDailyVerifications";
import { type DetalleIntento } from "../service/home/homeService";
import LoadingSpinner from "./Spinner";


// Colores de la app
const accentColor = "#fff";
const mutedText = "#a3a3a3";
const selectedBg = "#27272a";
const paperColor = "#303036";

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
  
  console.log('UTC Original:', utcTimestamp);
  console.log('UTC Date:', utcDate);
  console.log('CR Date:', costaRicaTime);
  console.log('Fecha formateada:', fechaFormatted);
  console.log('Hora formateada:', horaFormatted);
  
  return { fechaFormatted, horaFormatted, localDate: costaRicaTime };
};

// Función para transformar los datos de la API al formato de la tabla
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
        imagen: intento.image_source || persona.foto_perfil_url || "https://via.placeholder.com/50",
        timestamp: intento.timestamp, // UTC original para ordenamiento
        localTimestamp: localDate.getTime() // Timestamp local para ordenamiento alternativo
      });
    });
  });
  
  // Ordenar por timestamp descendente (más reciente primero)
  return tableData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Definición de columnas
const columns = [
  {
    name: "",
    selector: (row: any) => row.imagen,
    cell: (row: any) => (
      <img
        src={row.imagen}
        alt={row.nombre}
        className="w-15 h-12 my-1 rounded-sm object-cover border border-neutral-700"
        onError={(e: any) => {
          e.target.src = "https://via.placeholder.com/50x48/374151/9ca3af?text=?";
        }}
      />
    ),
    width: "90px",
    center: true,
    sortable: false,
  },
  {
    name: "Nombre",
    selector: (row: any) => row.nombre,
    sortable: true,
    grow: 2,
    cell: (row: any) => (
      <span className="font-medium text-white">{row.nombre}</span>
    ),
  },
  {
    name: "Fecha y hora",
    selector: (row: any) => row.timestamp,
    sortable: true,
    cell: (row: any) => (
      <div className="flex flex-col">
        <span className="text-neutral-300 text-sm">{row.fecha}</span>
        <span className="text-neutral-400 text-xs">{row.hora}</span>
      </div>
    ),
  },
  {
    name: "Acceso",
    selector: (row: any) => row.acceso,
    sortable: true,
    cell: (row: any) => (
      <span
        className={`font-bold px-2 py-1 rounded ${
          row.acceso === "Permitido"
            ? "bg-green-900/40 text-green-400"
            : "bg-red-900/40 text-red-400"
        }`}
      >
        {row.acceso}
      </span>
    ),
    center: true,
  },
];

// Paginación personalizada
const CustomPagination = (props: any) => (
  <div className="flex justify-end items-center gap-2 p-2 rounded-b" style={{
    background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
  }}>
    <button
      className="px-3 py-1 rounded bg-[#3f3f46] text-white font-bold hover:bg-[#18181b] transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => props.onChangePage(props.currentPage - 1)}
      disabled={props.currentPage === 1}
    >
      {"<"}
    </button>
    <span className="text-neutral-400 text-sm">
      Página {props.currentPage} de {props.totalPages}
    </span>
    <button
      className="px-3 py-1 rounded bg-[#3f3f46] text-white font-bold hover:bg-[#18181b] transition disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => props.onChangePage(props.currentPage + 1)}
      disabled={props.currentPage === props.totalPages}
    >
      {">"}
    </button>
  </div>
);

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
      background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
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
      color: mutedText,
      fontWeight: 500,
      fontSize: 14,
      letterSpacing: 0.2,
      background: "transparent",
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
    highlightOnHoverStyle: {
      backgroundColor: "#45454a",
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
    <div className="w-full">
      <DataTable
        columns={columns}
        data={tableData}
        pagination
        paginationPerPage={6}
        paginationRowsPerPageOptions={[6, 12, 18, 24]}
        paginationComponent={CustomPagination}
        highlightOnHover
        customStyles={customStyles}
        noDataComponent={<span className="text-neutral-400">Sin registros</span>}
      />
    </div>
  );
};

export default AccessTable;