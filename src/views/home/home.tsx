import { useState } from "react";
import AccessTable from "../../components/AccessTable";
import AccessChart from "../../components/AccessChart";
import DonutChart from "../../components/DonutChart";
import CameraStream from "../../components/CameraStream";
import { useHomeData } from "../../hooks/useHomeData";
import { useMonthlyStats } from "../../hooks/useMonthlyStats";
import { useVideoStream } from "../../hooks/useVideoStream";

const CameraModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { streamUrl, isStreamActive, error } = useVideoStream();

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="
          bg-[#23232a] rounded-xl p-4 md:p-6 shadow-lg flex flex-col items-center relative
          w-full max-w-[95vw] max-h-[95vh]
          min-w-[90vw] min-h-[60vh]
          sm:min-w-[500px] sm:min-h-[400px]
          md:min-w-[800px] md:min-h-[600px]
          "
        style={{ boxSizing: "border-box" }}
      >
        <button
          className="absolute top-2 right-2 text-neutral-400 hover:text-white text-xl z-10"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        
        <div className="w-full h-full bg-[#18181b] rounded-lg flex items-center justify-center overflow-hidden">
          {isStreamActive ? (
            <img
              src={streamUrl}
              alt="Stream en vivo - Pantalla completa"
              className="w-full h-full object-contain"
              onError={() => console.error('Error al cargar stream en modal')}
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <span className="text-neutral-400 text-lg">Cámara en vivo</span>
              <span className="text-red-400 text-sm">
                {error || 'Sin señal de cámara'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { totalData, loading, error } = useHomeData();
  const { monthlyStats, loading: monthlyLoading, error: monthlyError } = useMonthlyStats();

  // Obtener datos del mes actual (último mes en el array)
  const currentMonthData = monthlyStats.length > 0 ? monthlyStats[monthlyStats.length - 1] : null;

  return (
    <div className="w-full min-h-[600px] p-2 md:p-4">
      <div className="flex flex-col gap-4 w-full">
        {/* Fila superior: gráfica y estadísticas */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Gráfica */}
          <div
            className="flex-1 rounded-lg shadow p-4 min-h-[370px] flex items-center justify-center"
            style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}
          >
            <AccessChart totalData={totalData} loading={loading} error={error} />
          </div>
          
          {/* Estadísticas mensuales */}
          <div className="w-full md:w-[350px] rounded-lg shadow p-4 min-h-[370px] flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}>
            {/* Mostrar loading primero, luego error, luego datos, y finalmente el estado sin datos */}
            {monthlyLoading ? (
              <DonutChart 
                monthlyData={{
                  autorizados: 0,
                  rechazados: 0,
                  total_verificaciones: 0,
                  tasa_autorizacion: 0,
                  mes_nombre: '',
                  personas_unicas: 0
                }}
                loading={true}
                error={null}
              />
            ) : monthlyError ? (
              <DonutChart 
                monthlyData={{
                  autorizados: 0,
                  rechazados: 0,
                  total_verificaciones: 0,
                  tasa_autorizacion: 0,
                  mes_nombre: '',
                  personas_unicas: 0
                }}
                loading={false}
                error={monthlyError}
              />
            ) : currentMonthData ? (
              <DonutChart 
                monthlyData={currentMonthData} 
                loading={false} 
                error={null} 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-neutral-400 text-sm">No hay datos del mes</span>
              </div>
            )}
          </div>

          {/* Cámara en vivo */}
          <div className="w-full md:w-[350px] rounded-lg shadow p-4 min-h-[370px] flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}>
            <div className="flex flex-col items-center gap-3 w-full h-full">
              <h3 className="text-white font-semibold text-lg">Cámara en Vivo</h3>
              <div className="flex-1 flex items-center justify-center w-full">
                <CameraStream 
                  size="large"
                  onClick={() => setModalOpen(true)}
                  className="w-full h-full max-w-[280px] max-h-[210px] cursor-pointer"
                />
              </div>
              <span className="text-neutral-400 text-xs">Click para ampliar</span>
            </div>
          </div>
        </div>

        {/* Fila inferior: tabla de accesos */}
        <div className="w-full">
          {/* Tabla de accesos */}
          <div className="rounded-lg shadow p-4 min-h-[370px] flex items-center justify-center"
            style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}>
            <AccessTable />
          </div>
        </div>
      </div>
      <CameraModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;