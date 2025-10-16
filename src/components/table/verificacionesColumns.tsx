import { type TableProps } from "react-data-table-component";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
interface ExtendedVerificacion extends Verificacion {}
import imagen from "../../assets/noUser.jpg";
import type { Verificacion } from "../../types/ingresados";

// Este componente se utiliza para definir las columnas de la tabla de personas, utilizado en las paginas lista de verificaciones.

export const getVerificacionesColumns = (
  handleSelectPhoto: (imageUrl: string, alt: string) => void
): TableProps<ExtendedVerificacion>["columns"] => [
  {
    name: "Foto",
    selector: (row) => row.image_source,
    cell: (row) => {
      const imageUrl = row.image_source || imagen;
      const alt = row.person_label ?? "Desconocido";
      
      return (
        <button
          className="group relative focus:outline-none"
          onClick={() => handleSelectPhoto(imageUrl, alt)}
          title="Ver foto"
          style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          type="button"
        >
          <img
            src={imageUrl}
            alt={alt}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#ccc] group-hover:opacity-70 transition"
            onError={(e) => {
              (e.target as HTMLImageElement).src = imagen;
            }}
          />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PhotoCameraIcon className="text-white bg-black/60 rounded-full p-1" fontSize="small" />
          </span>
        </button>
      );
    },
    width: "80px",
    sortable: false,
  },
  {
    name: "Nombre Completo",
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
    selector: (row) => row.ts,
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>
        {row.ts ? convertToCostaRicaTime(row.ts).fechaFormatted : 'N/A'}
      </span>
    ),
  },
  {
    name: "Hora",
    selector: (row) => row.ts,
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>
        {row.ts ? convertToCostaRicaTime(row.ts).horaFormatted : 'N/A'}
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
            ? "bg-[#6FBF73] text-green-100"
            : "bg-[#B85C5C] text-red-100"
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