import { type TableProps } from "react-data-table-component";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { type Verificacion } from "../../service/ingresados/ingresadosService";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
interface ExtendedVerificacion extends Verificacion {}

// Este componente se utiliza para definir las columnas de la tabla de personas, utilizado en las paginas lista de verificaciones.


export const getVerificacionesColumns = (
  handleSelectPhoto: (row: ExtendedVerificacion) => void
): TableProps<ExtendedVerificacion>["columns"] => [
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
      <span className="font-semibold" style={{ color: "#1f364a" }}>
        {row.person_label ?? "Desconocido"}
      </span>
    ),
  },
  {
    name: "Fecha",
    selector: (row) => row.timestamp,
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>
        {row.timestamp ? convertToCostaRicaTime(row.timestamp).fechaFormatted : 'N/A'}
      </span>
    ),
  },
  {
    name: "Hora",
    selector: (row) => row.timestamp,
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>
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
      <span style={{ color: "#1f364a" }}>{row.faces_detected}</span>
    ),
    width: "150px",
  },
];

export { convertToCostaRicaTime };
export type { ExtendedVerificacion };