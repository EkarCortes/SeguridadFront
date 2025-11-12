import { type TableProps } from "react-data-table-component";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import imagen from "../../assets/noUser.jpg";
import type { User } from "../../types/users";

interface ExtendedUser extends User {

}

export const getUsersColumns = (
  handleEdit: (row: ExtendedUser) => void,
  handleDelete: (row: ExtendedUser) => void,
  handleSelectPhoto: (imageUrl: string, alt: string) => void
): TableProps<ExtendedUser>["columns"] => [
  {
    name: "Foto",
    selector: (row) => row.foto_url,
    cell: (row) => {
      const imageUrl = row.foto_url || imagen;

      return (
        <button
          className="group relative focus:outline-none"
          onClick={() => handleSelectPhoto(imageUrl, row.nombre)}
          title="Ver foto"
          style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          type="button"
        >
          <img
            src={imageUrl}
            alt={row.nombre}
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
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
    cell: (row) => (
      <span style={{ color: "#1f364a" }}>{row.email}</span>
    ),
  },
  {
    name: "Rol",
    selector: (row) => row.rol,
    sortable: true,
    cell: (row) => (
      <span 
        className={`px-3 py-1 text-xs font-bold rounded ${
          row.rol === 'admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}
      >
        {row.rol === 'admin' ? 'Administrador' : 'Usuario'}
      </span>
    ),
  },
  {
    name: "Estado",
    selector: (row) => row.activo,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-3 py-1 text-xs font-bold ${
          row.activo
            ? "bg-[#6FBF73] text-green-100"
            : "bg-[#B85C5C] text-red-100"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {row.activo ? "Activo" : "Inactivo"}
      </span>
    ),
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
  },
  {
    name: "Acciones",
    cell: (row) => (
      <div className="flex gap-2">
        <button
          className="p-1 rounded hover:bg-gray-200 transition"
          onClick={() => handleEdit(row)}
          title="Editar"
        >
          <EditIcon className="text-[#5C7FB8] hover:text-[#496593]" fontSize="small" />
        </button>
        <button
          className="p-1 rounded hover:bg-gray-200 transition"
          onClick={() => handleDelete(row)}
          title="Eliminar"
        >
          <DeleteIcon className="text-[#B85C5C] hover:text-[#934949]" fontSize="small" />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    width: "90px",
  },
];

export type { ExtendedUser };