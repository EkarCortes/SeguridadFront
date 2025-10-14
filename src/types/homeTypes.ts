//Utilizado en el grafico de barras
export interface SummaryData {
    date_from: string;
    date_to: string;
    cam_id: string | null;
    total: number;
    aceptados: string | number;
    rechazados: string | number;
    tasa_aceptacion: number;
  }
//Normaliza los datos para el grafico de barras
  export interface TimeSeriesData {
    fecha: string;
    aceptados: number;
    rechazados: number;
    total: number;
  }

  // Utilizado en las estadisticas mensuales en el donut
  export interface MonthlyStats {
    año: number;
    mes: number;
    mes_nombre: string;
    total_verificaciones: number;
    autorizados: number;
    rechazados: number;
    tasa_autorizacion: number;
    personas_unicas: number;
    camaras_activas: number;
  }
  // Utilizado en la respuesta de las estadisticas mensuales
  export interface MonthlyStatsResponse {
    total_meses: number;
    estadisticas_mensuales: MonthlyStats[];
  }
  
  // Utilizado en las verificaciones diarias
  export interface DetalleIntento {
    id: number;
    timestamp: string;
    cam_id: string;
    faces_detected: number;
    authorized: boolean;
    distance: number;
    threshold: number;
    image_source: string;
  }
  // Utilizado en la actividad por persona en las verificaciones diarias
  export interface ActividadPersona {
    nombre: string;
    cedula: string | null;
    email: string | null;
    telefono: string | null;
    foto_perfil_url: string;
    total_intentos: number;
    intentos_autorizados: number;
    intentos_rechazados: number;
    tasa_autorizacion: number;
    primer_intento: string;
    ultimo_intento: string;
    fotos_intentos: string[];
    detalle_intentos: DetalleIntento[];
  }
  // Utilizado en la respuesta de las verificaciones diarias
  export interface DailyVerificationsResponse {
    fecha: string;
    total_personas_activas: number;
    total_verificaciones: number;
    total_autorizadas: number;
    total_rechazadas: number;
    actividad_por_persona: ActividadPersona[];
  }
  