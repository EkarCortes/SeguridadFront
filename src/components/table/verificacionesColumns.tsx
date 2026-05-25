import type { ColumnProps } from 'primereact/column';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import imagen from "../../assets/noUser.jpg";
import type { Verificacion } from "../../types/ingresados";

interface ExtendedVerificacion extends Verificacion {}

export const getVerificacionesColumns = (
  handleSelectPhoto: (imageUrl: string, alt: string) => void
): (ColumnProps & { field: string })[] => [
  {
    field: 'image_source',
    header: 'Foto',
    style: { width: '64px', paddingLeft: '20px', paddingRight: '8px' },
    body: (row: ExtendedVerificacion) => {
      const imageUrl = row.image_source || imagen;
      const alt = row.person_label ?? "Desconocido";
      return (
        <button
          className="group relative focus:outline-none"
          onClick={() => handleSelectPhoto(imageUrl, alt)}
          title="Ver foto"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          type="button"
        >
          <img
            src={imageUrl}
            alt={alt}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 group-hover:opacity-75 transition"
            onError={(e) => { (e.target as HTMLImageElement).src = imagen; }}
          />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PhotoCameraIcon sx={{ fontSize: 14, color: '#fff', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '2px' }} />
          </span>
        </button>
      );
    },
  },
  {
    field: 'person_label',
    header: 'Nombre Completo',
    sortable: true,
    body: (row: ExtendedVerificacion) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800 text-sm leading-tight">
          {row.person_label ?? "Desconocido"}
        </span>
      
      </div>
    ),
  },
  {
    field: 'ts_fecha',
    header: 'Fecha',
    sortable: true,
    body: (row: ExtendedVerificacion) => (
      <span className="text-slate-600 text-sm">
        {row.ts ? convertToCostaRicaTime(row.ts).fechaFormatted : '—'}
      </span>
    ),
  },
  {
    field: 'ts_hora',
    header: 'Hora',
    body: (row: ExtendedVerificacion) => (
      <span className="text-slate-600 text-sm">
        {row.ts ? convertToCostaRicaTime(row.ts).horaFormatted : '—'}
      </span>
    ),
  },
  {
    field: 'authorized',
    header: 'Estado',
    sortable: true,
    body: (row: ExtendedVerificacion) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        row.authorized
          ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
          : 'bg-red-50 text-red-600 ring-1 ring-red-200'
      }`}>
        {row.authorized ? 'Autorizado' : 'Denegado'}
      </span>
    ),
  },
  {
    field: 'faces_detected',
    header: 'Caras Detectadas',
    sortable: true,
    style: { width: '80px' },
    bodyClassName: 'text-center',
    headerClassName: 'text-center',
    body: (row: ExtendedVerificacion) => (
      <span className="text-slate-500 text-sm">{row.faces_detected ?? '—'}</span>
    ),
  },
];

export { convertToCostaRicaTime };
export type { ExtendedVerificacion };
