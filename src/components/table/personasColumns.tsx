import type { ColumnProps } from 'primereact/column';
import { Pencil, Trash2 } from 'lucide-react';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import imagen from "../../assets/noUser.jpg";
import type { Persona } from "../../types/agregados";

interface ExtendedPersona extends Persona { id?: number }

export const getPersonasColumns = (
  handleEdit: (row: ExtendedPersona) => void,
  handleDelete: (row: ExtendedPersona) => void,
  handleSelectPhoto: (imageUrl: string, alt: string) => void
): (ColumnProps & { field: string })[] => [
  {
    field: 'foto_url',
    header: 'Foto',
    style: { width: '64px', paddingLeft: '20px', paddingRight: '8px' },
    body: (row: ExtendedPersona) => {
      const imageUrl = row.foto_url
        ? row.foto_url.startsWith("https://facerecognition.naturalaloe.dev/")
          ? row.foto_url
          : `https://facerecognition.naturalaloe.dev/${row.foto_url.replace(/^\/+/, "")}`
        : imagen;
      return (
        <button
          className="group relative focus:outline-none"
          onClick={() => handleSelectPhoto(imageUrl, row.nombre)}
          title="Ver foto"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          type="button"
        >
          <img
            src={imageUrl}
            alt={row.nombre}
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
    field: 'nombre',
    header: 'Nombre Completo',
    sortable: true,
    body: (row: ExtendedPersona) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800 text-sm leading-tight">{row.nombre}</span>
      
      </div>
    ),
  },
  {
    field: 'cedula',
    header: 'Cédula',
    sortable: true,
    body: (row: ExtendedPersona) => (
      <span className="text-slate-600 text-sm">{row.cedula || '—'}</span>
    ),
  },
  {
    field: 'email',
    header: 'Email',
    sortable: true,
    body: (row: ExtendedPersona) => (
      <span className="text-slate-600 text-sm">{row.email || '—'}</span>
    ),
  },
  {
    field: 'telefono',
    header: 'Teléfono',
    body: (row: ExtendedPersona) => (
      <span className="text-slate-600 text-sm">{row.telefono || '—'}</span>
    ),
  },
  {
    field: 'ultimo_acceso',
    header: 'Último Acceso',
    sortable: true,
    body: (row: ExtendedPersona) => (
      <span className="text-slate-500 text-sm">
        {row.ultimo_acceso ? convertToCostaRicaTime(row.ultimo_acceso).fechaFormatted : '—'}
      </span>
    ),
  },
  {
    field: 'acciones',
    header: 'Acciones',
    style: { width: '88px' },
    body: (row: ExtendedPersona) => (
      <div className="flex items-center gap-1.5">
        <button
          className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition"
          onClick={() => handleEdit(row)}
          title="Editar"
        >
          <Pencil size={14} />
        </button>
        <button
          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
          onClick={() => handleDelete(row)}
          title="Eliminar"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
  },
];

export type { ExtendedPersona };
