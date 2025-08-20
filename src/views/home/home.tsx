import { useState } from "react";
import AccessTable from "../../components/AccessTable";
import AccessChart from "../../components/AccessChart";
import DonutChart from "../../components/DonutChart";
import { useHomeData } from "../../hooks/useHomeData";
import { useMonthlyStats } from "../../hooks/useMonthlyStats";
import { useVideoStream } from "../../hooks/useVideoStream";

const CameraModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { streamUrl } = useVideoStream();

  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="relative w-full h-full max-w-2xl max-h-[60vh] bg-[#23232a] rounded-xl overflow-hidden ">
        {/* Header del modal */}
        <div className="absolute top-0 left-0 right-0 bg-[#23232a] p-4 z-20 flex justify-between items-center border-b border-[#303036]">
          <h2 className="text-white font-semibold text-lg">Cámara en Vivo</h2>
          <button
            className="text-neutral-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-700 transition-colors"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        
        {/* Contenido del video */}
      <div className="pt-16 h-full bg-[#18181b] flex items-center justify-center">
  {streamUrl ? (
    <iframe
      src={streamUrl}
      className="w-full h-full border-0"
      allow="camera; microphone; fullscreen"
      sandbox="allow-same-origin allow-scripts allow-forms"
      title="Stream en vivo - Pantalla completa"
      referrerPolicy="no-referrer-when-downgrade"
    />
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neutral-600 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <span className="text-neutral-400 text-lg block mb-2">Cámara en vivo</span>
        <span className="text-neutral-500 text-sm">Cargando stream...</span>
      </div>
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

          {/* Botón Ver Cámara en Vivo */}
          <div className="w-full md:w-[350px] rounded-lg shadow p-4 min-h-[370px] flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(180deg, #23232a 0%, #1a1a1f 100%)`,
            }}>
            <div className="flex flex-col items-center gap-6 w-full h-full justify-center">
              {/* Icono de cámara */}
            
              
              {/* Título */}
              <h3 className="text-white font-semibold text-lg text-center">Cámara de Seguridad</h3>
              
              {/* Botón principal */}
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg flex items-center gap-2"
              >
           
                <span>Ver cámara en vivo</span>
              </button>
              
              {/* Texto descriptivo */}
              <p className="text-neutral-400 text-sm text-center max-w-60">
                Visualiza el feed en tiempo real de la cámara de seguridad
              </p>
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