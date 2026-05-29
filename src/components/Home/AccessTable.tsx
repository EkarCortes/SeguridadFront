import { useState } from "react";
import { convertToCostaRicaTime } from "../../utils/dateUtils";
import image from "../../assets/noUser.jpg";
import ImageModal from "../Ui/ImageModal";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DataTableProp from "../table/DataTableProp";
import type { ColumnProps } from "primereact/column";
import type { DetalleIntento, DailyVerificationsResponse } from "../../types/homeTypes";

interface AccessTableProps {
  data: DailyVerificationsResponse | null;
  loading: boolean;
  error: string | null;
}

interface AccessRow {
  id: string | number;
  nombre: string;
  fecha: string;
  hora: string;
  acceso: "Permitido" | "Denegado";
  imagen: string;
  timestamp: string;
}

const transformDataForTable = (data: any): AccessRow[] => {
  if (!data?.actividad_por_persona) return [];
  const rows: AccessRow[] = [];
  data.actividad_por_persona.forEach((persona: any) => {
    persona.detalle_intentos.forEach((intento: DetalleIntento) => {
      const { fechaFormatted, horaFormatted } = convertToCostaRicaTime(intento.timestamp);
      rows.push({
        id: intento.id,
        nombre: persona.nombre,
        fecha: fechaFormatted,
        hora: horaFormatted,
        acceso: intento.authorized ? "Permitido" : "Denegado",
        imagen: intento.image_source || persona.foto_perfil_url || image,
        timestamp: intento.timestamp,
      });
    });
  });
  return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const AccessTable = ({ data, loading, error }: AccessTableProps) => {
  const tableData = data ? transformDataForTable(data) : [];

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState<string>('');

  const handleSelectPhoto = (imageUrl: string, alt: string) => {
    setSelectedImage(imageUrl);
    setImageAlt(alt);
    setIsImageModalOpen(true);
  };

  const columns: (ColumnProps & { field: string })[] = [
    {
      field: 'imagen',
      header: 'Foto',
      style: { width: '72px' },
      body: (row: AccessRow) => (
        <button
          className="group relative focus:outline-none"
          onClick={() => handleSelectPhoto(row.imagen || image, row.nombre)}
          title="Ver foto"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
          type="button"
        >
          <img
            src={row.imagen || image}
            alt={row.nombre}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 group-hover:opacity-70 transition"
            onError={(e) => { (e.target as HTMLImageElement).src = image; }}
          />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <PhotoCameraIcon className="text-white bg-black/60 rounded-full p-1" fontSize="small" />
          </span>
        </button>
      ),
    },
    {
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      body: (row: AccessRow) => <span className="font-semibold text-slate-800">{row.nombre}</span>,
    },
    {
      field: 'fecha',
      header: 'Fecha',
      sortable: true,
      body: (row: AccessRow) => <span>{row.fecha}</span>,
    },
    {
      field: 'hora',
      header: 'Hora',
      sortable: true,
      body: (row: AccessRow) => <span>{row.hora}</span>,
    },
    {
      field: 'acceso',
      header: 'Acceso',
      sortable: true,
      body: (row: AccessRow) => (
        <span className={`px-3 py-1 text-xs font-bold rounded ${
          row.acceso === "Permitido"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
        }`}>
          {row.acceso}
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="px-5 pt-5 pb-1">
        <h2
          className="text-base font-bold text-slate-800"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Registros de acceso diario
        </h2>
        <p className="text-sm text-slate-400 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
          {tableData.length} {tableData.length !== 1 ? 'registros' : 'registro'}
        </p>
      </div>

      <DataTableProp
        value={tableData}
        loading={loading}
        columns={columns}
        rows={6}
        totalRecords={tableData.length}
        scrollHeight="auto"
        className="p-4 pt-2"
      />

      <ImageModal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={() => { setIsImageModalOpen(false); setSelectedImage(null); setImageAlt(''); }}
        alt={imageAlt}
      />
    </>
  );
};

export default AccessTable;
