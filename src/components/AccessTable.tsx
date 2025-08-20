import DataTable, { type TableProps } from "react-data-table-component";

// Colores de la app
const accentColor = "#fff";
const mutedText = "#a3a3a3";
const selectedBg = "#27272a";
const paperColor = "#303036";

// Ejemplo de datos
const data = [
  {
    id: 1,
    nombre: "Juan Pérez",
    fecha: "2025/08/19",
    hora: "08:15",
    acceso: "Permitido",
    imagen: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    nombre: "Desconocido",
    fecha: "2025/08/19",
    hora: "08:20",
    acceso: "Denegado",
    imagen: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    fecha: "2025/08/19",
    hora: "08:25",
    acceso: "Permitido",
    imagen: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    fecha: "2025/08/19",
    hora: "08:25",
    acceso: "Permitido",
    imagen: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 3,
    nombre: "Carlos Ruiz",
    fecha: "2025/08/19",
    hora: "08:25",
    acceso: "Permitido",
    imagen: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  // ...más datos
];

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
    selector: (row: any) => `${row.fecha} ${row.hora}`,
    sortable: true,
    cell: (row: any) => (
      <span className="text-neutral-400 text-sm">{`${row.fecha} ${row.hora}`}</span>
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
  <div className="flex justify-end items-center gap-2 p-2  rounded-b" style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}>
    <button
      className="px-3 py-1 rounded bg-[#3f3f46] text-white font-bold hover:bg-[#18181b] transition"
      onClick={() => props.onChangePage(props.currentPage - 1)}
      disabled={props.currentPage === 1}
    >
      {"<"}
    </button>
    <span className="text-neutral-400 text-sm">
      Página {props.currentPage} de {props.totalPages}
    </span>
    <button
      className="px-3 py-1 rounded bg-[#3f3f46] text-white font-bold hover:bg-[#18181b] transition"
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
      outline: "none", //none, 
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

const AccessTable = () => (
  <div className="w-full">
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 10, 15, 20]}
      paginationComponent={CustomPagination}
      highlightOnHover
      customStyles={customStyles}
      noDataComponent={<span className="text-neutral-400">Sin registros</span>}
    />
  </div>
);

export default AccessTable;