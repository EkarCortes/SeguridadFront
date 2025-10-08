import { type TableProps } from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import api from "../../config/apiconfig";
import { type Persona } from "../../service/agregados/agregadosService";

// Este componente se utiliza para definir las columnas de la tabla de personas, utilizado en las paginas lista de agregados.

interface ExtendedPersona extends Persona {
  id?: number;
}

export const getPersonasColumns = (
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
    cell: (row) => <span className="font-semibold" style={{ color: "#1f364a" }}>{row.nombre}</span>,
  },
  {
    name: "Cédula",
    selector: (row) => row.cedula || 'N/A',
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>{row.cedula || 'N/A'}</span>
    ),
  },
  {
    name: "Email",
    selector: (row) => row.email || 'N/A',
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>{row.email || 'N/A'}</span>
    ),
  },
  {
    name: "Teléfono",
    selector: (row) => row.telefono || 'N/A',
    sortable: false,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>{row.telefono || 'N/A'}</span>
    ),
  },
  {
    name: "Primer Acceso",
    selector: (row) => row.primer_acceso || '',
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>
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
      <span style={{ color: "#1f364a" }}>
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
      <span style={{ color: "#1f364a" }}>
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

export type { ExtendedPersona };