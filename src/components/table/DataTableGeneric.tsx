import { Search, RefreshCw } from 'lucide-react';
import type { ColumnProps } from 'primereact/column';
import DataTableProp from './DataTableProp';

interface DataTableGenericProps {
  data: any[];
  columns: (ColumnProps & { field: string })[];
  totalItems: number;
  loading?: boolean;
  error?: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  title: string;
  subtitle?: string;
  searchPlaceholder: string;
  rows?: number;
  additionalActions?: React.ReactNode;
  onRowDelete?: (id: number) => void;
}

export default function DataTableGeneric({
  data,
  columns,
  totalItems,
  loading = false,
  error = null,
  searchValue,
  onSearchChange,
  onRefresh,
  title,
  subtitle,
  searchPlaceholder,
  rows = 10,
  additionalActions,
  onRowDelete,
}: DataTableGenericProps) {
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <span className="text-red-400 text-sm font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl font-bold text-slate-900 leading-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-sm text-slate-500 mt-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
              style={{ fontFamily: "'Inter', sans-serif" }}
              type="button"
            >
              <RefreshCw size={14} />
              Actualizar
            </button>
          )}
          {additionalActions}
        </div>
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 h-10 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>

        <DataTableProp
          value={data}
          loading={loading}
          columns={columns}
          rows={rows}
          totalRecords={totalItems}
          recordsReportLabel="registros"
          onRowDelete={onRowDelete}
          scrollHeight="auto"
        />
      </div>
    </div>
  );
}
