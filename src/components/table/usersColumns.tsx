import type { ColumnProps } from 'primereact/column';
import { Trash2 } from 'lucide-react';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import imagen from "../../assets/noUser.jpg";
import type { UserAccount } from "../../types/users";

interface ExtendedUser extends UserAccount {}

export const getUsersColumns = (
  handleDelete: (row: ExtendedUser) => void,
  handleSelectPhoto: (imageUrl: string, alt: string) => void
): (ColumnProps & { field: string })[] => [
  {
    field: 'foto',
    header: 'Foto',
    style: { width: '64px', paddingLeft: '20px', paddingRight: '8px' },
    body: (row: ExtendedUser) => {
      const imageUrl = row.foto || imagen;
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
    body: (row: ExtendedUser) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800 text-sm leading-tight">{row.username}</span>
      </div>
    ),
  },
  {
    field: 'email',
    header: 'Email',
    sortable: true,
    body: (row: ExtendedUser) => (
      <span className="text-slate-600 text-sm">{row.email}</span>
    ),
  },
  {
    field: 'rol',
    header: 'Rol',
    sortable: true,
    body: (row: ExtendedUser) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        row.rol === 'admin'
          ? 'bg-slate-800 text-slate-100'
          : row.rol === 'operador'
          ? 'bg-slate-100 text-slate-800 ring-1 ring-slate-800'
          : 'bg-slate-100 text-slate-800 ring-1 ring-slate-300'
      }`}>
        {row.rol === 'admin' ? 'Administrador' : row.rol === 'operador' ? 'Operador' : 'Guarda'}
      </span>
    ),
  },
  {
    field: 'estado',
    header: 'Estado',
    sortable: true,
    body: (row: ExtendedUser) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        row.estado
          ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
          : 'bg-red-50 text-red-600 ring-1 ring-red-200'
      }`}>
        {row.estado ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
  {
    field: 'estado_registro',
    header: 'Fecha Registro',
    sortable: true,
    body: (row: ExtendedUser) => (
      <span className="text-slate-500 text-sm">
        {convertToCostaRicaTime(row.estado_registro).fechaFormatted}
      </span>
    ),
  },
  {
    field: 'acciones',
    header: 'Acciones',
    style: { width: '72px' },
    body: (row: ExtendedUser) => (
      <button
        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
        onClick={() => handleDelete(row)}
        title="Eliminar"
      >
        <Trash2 size={14} />
      </button>
    ),
  },
];

export type { ExtendedUser };
