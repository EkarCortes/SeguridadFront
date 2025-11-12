export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'user' | 'viewer';
    activo: boolean;
    foto_url: string;
    fecha_registro: string;
    ultimo_login?: string;
  }