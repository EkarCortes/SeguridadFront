import { type TableProps } from "react-data-table-component";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import imagen from "../../assets/noUser.jpg";
import type {  UserAccount } from "../../types/users";

interface ExtendedUser extends UserAccount {

}

export const getUsersColumns = (
  handleDelete: (row: ExtendedUser) => void,
  handleSelectPhoto: (imageUrl: string, alt: string) => void
): TableProps<ExtendedUser>["columns"] => [
  {
    name: "Foto",
    selector: (row) => row.foto,
    cell: (row) => {
      const imageUrl = row.foto || imagen;

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
    name: "Username",
    selector: (row) => row.username,
    sortable: true,
    cell: (row) => <span className="font-semibold" style={{ color: "#1f364a" }}>{row.username}</span>,
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
        ? 'bg-[#1F2937] text-[#D1D5DB]'
        : row.rol === 'operador'
        ? 'bg-[#D1D5DB] text-[#1F2937]'
        : 'bg-[#D1D5DB] text-[#1F2937]'
        }`}
      >
        {row.rol === 'admin'
          ? 'Administrador'
          : row.rol === 'operador'
          ? 'Operador'
          : 'Guarda'}
      </span>
    ),
  },
  {
    name: "Estado",
    selector: (row) => row.estado,
    sortable: true,
    cell: (row) => (
      <span
        className={`px-3 py-1 text-xs font-bold ${
          row.estado
            ? "bg-[#6FBF73] text-green-100"
            : "bg-[#B85C5C] text-red-100"
        }`}
        style={{ borderRadius: "4px" }}
      >
        {row.estado ? "Activo" : "Inactivo"}
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