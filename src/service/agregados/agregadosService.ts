import api from '../../config/apiconfig';

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

export interface PersonsResponse {
  total_personas: number;
  personas: Persona[];
}

export interface PersonFormData {
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  fotos: File[];
}

export interface PersonUpdateData {
  cedula?: string;
  email?: string;
  telefono?: string;
  fotos_nuevas?: File[];
}

export const agregadosService = {
  getPersons: async (): Promise<PersonsResponse> => {
    try {
      const response = await api.get('/persons');
      return response.data;
    } catch (error) {
      console.error('Error fetching persons data:', error);
      throw error;
    }
  },

  registerPerson: async (personData: PersonFormData): Promise<any> => {
    try {
      const formData = new FormData();
      
      // Agregar campos de texto
      formData.append('nombre', personData.nombre);
      formData.append('cedula', personData.cedula);
      formData.append('email', personData.email);
      formData.append('telefono', personData.telefono);
      
      // Agregar archivos de fotos
      personData.fotos.forEach((foto, _index) => {
        formData.append('fotos', foto);
      });

      const response = await api.post('/persons/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error registering person:', error);
      throw error;
    }
  },

  updatePerson: async (nombre: string, updateData: PersonUpdateData): Promise<any> => {
    try {
      console.log('=== UPDATE PERSON DEBUG ===');
      console.log('Nombre a actualizar:', nombre);
      console.log('Datos de actualización recibidos:', updateData);
      
      const formData = new FormData();
      
      // Agregar campos de texto que se pueden actualizar
      if (updateData.cedula) {
        formData.append('cedula', updateData.cedula);
        console.log('Agregando cedula:', updateData.cedula);
      }
      if (updateData.email) {
        formData.append('email', updateData.email);
        console.log('Agregando email:', updateData.email);
      }
      if (updateData.telefono) {
        formData.append('telefono', updateData.telefono);
        console.log('Agregando telefono:', updateData.telefono);
      }
      
      // Agregar nuevas fotos si se proporcionan
      if (updateData.fotos_nuevas && updateData.fotos_nuevas.length > 0) {
        console.log(`Agregando ${updateData.fotos_nuevas.length} fotos nuevas:`);
        updateData.fotos_nuevas.forEach((foto, index) => {
          formData.append('fotos_nuevas', foto);
          console.log(`  Foto ${index + 1}:`, foto.name, `(${foto.size} bytes)`);
        });
      } else {
        console.log('No se agregaron fotos nuevas');
      }

      // Mostrar contenido del FormData
      console.log('=== CONTENIDO DEL FORMDATA ===');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `Archivo - ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}:`, value);
        }
      }

      console.log('URL de la petición:', `/persons/${encodeURIComponent(nombre)}/update`);
      console.log('=== ENVIANDO PETICIÓN ===');

      const response = await api.put(`/persons/${encodeURIComponent(nombre)}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('=== RESPUESTA EXITOSA ===');
      console.log('Status:', response.status);
      console.log('Response data:', response.data);

      return response.data;
    } catch (error) {
      console.error('=== ERROR EN UPDATE PERSON ===');
      console.error('Error updating person:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response: any };
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        console.error('Response headers:', err.response.headers);
      }
      throw error;
    }
  }
};