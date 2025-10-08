import { useState } from "react";
import DataTable, { type TableProps } from "react-data-table-component";
import RefreshIcon from "@mui/icons-material/Refresh";

// Este componente es una tabla genérica reutilizable con funcionalidades comunes como búsqueda, paginación y manejo de estados de carga y error, utilizado en las paginas de listaAgregados y listaVerificaciones.

interface DataTableGenericProps<T> {
  data: T[];
  columns: TableProps<T>["columns"];
  totalItems: number;
  loading?: boolean;
  error?: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  title: string;
  searchPlaceholder: string;
  noDataMessage: string;
  rowsPerPage?: number;
  additionalActions?: React.ReactNode;
  customStyles?: any;
}

export default function DataTableGeneric<T>({
  data,
  columns,
  totalItems,
  loading = false,
  error = null,
  searchValue,
  onSearchChange,
  onRefresh,
  title,
  searchPlaceholder,
  noDataMessage,
  rowsPerPage = 10,
  additionalActions,
  customStyles
}: DataTableGenericProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value);
    setCurrentPage(1);
  }

  if (loading) {
    return (
      <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
        <div className="text-red-400 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] p-2 md:p-4 flex items-center justify-center">
      <div
        className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6 flex flex-col gap-6"
        style={{ color: "#1f364a" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: "#1f364a" }}>
            {title}
          </h2>
          <div className="text-sm" style={{ color: "#1f364a" }}>
            Total: {totalItems} {totalItems !== 1 ? 'elementos' : 'elemento'}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="rounded bg-[#f3f6fa] text-[#1f364a] px-3 py-2 w-80 border border-[#dbeafe] focus:outline-none focus:ring-2 focus:ring-blue-700"
            style={{ minWidth: 0 }}
          />
          
          <div className="flex gap-2">
            {additionalActions}
            {onRefresh && (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-800 transition"
                onClick={onRefresh}
                title=""
                type="button"
              >
             <RefreshIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
        
        <div className="rounded-lg shadow-lg bg-white p-2">
          <DataTable
            columns={columns}
            data={data}
            customStyles={customStyles}
            pagination
            paginationPerPage={rowsPerPage}
            paginationRowsPerPageOptions={[rowsPerPage]}
            paginationComponentOptions={{
              rowsPerPageText: "Filas por página",
              rangeSeparatorText: "de",
              noRowsPerPage: true,
              selectAllRowsItem: false,
            }}
            onChangePage={setCurrentPage}
            paginationDefaultPage={currentPage}
            noDataComponent={
              <div className="py-6 text-center" style={{ color: "#1f364a" }}>
                {noDataMessage}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}