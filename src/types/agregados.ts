//Pantalla de Agregados - Personas

// Tipo para representar una persona y su información relevante
export interface Persona {
  nombre: string;
  cedula: string | null;
  email: string | null;
  telefono: string | null;
  foto_url: string;
  encodings_count: number;
  total_intentos: number;
  autorizados: number;
  rechazados: number;
  tasa_autorizacion: number;
  ultimo_acceso: string | null;
  primer_acceso: string | null;
  fecha_registro: string;
}

// Tipo para la respuesta de la API al obtener la lista de personas
export interface PersonsResponse {
  total_personas: number;
  personas: Persona[];
}

// Tipo para los datos del formulario al registrar una nueva persona
export interface PersonFormData {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  fotos: File[];
}

// Tipo para los datos que se pueden actualizar de una persona
export interface PersonUpdateData {
  cedula?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  photos?: File[];
}