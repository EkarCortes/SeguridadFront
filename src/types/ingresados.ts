// Esta interfaz define la estructura de los datos de verificación de personas ingresadas.
export interface Verificacion {
    id: number;
    ts: string;
    image_source: string;
    faces_detected: number;
    authorized: boolean
    person_label: string | null; 
  }

// Esta interfaz define la estructura de la respuesta de la API para las verificaciones de personas ingresadas.
  export interface VerificationsResponse {
    total_registros: number;
    registros: Verificacion[];
  }