export type RolUsuario =
  | 'coordinador_provincial'
  | 'coordinador_recinto'
  | 'veedor';

export interface Perfil {
  id: string;
  email: string;
  cedula: string | null;
  nombre_completo: string;
  nombres: string | null;
  apellidos: string | null;
  telefono: string | null;
  role: RolUsuario;
  provincia_id: number | null;
  recinto_id: number | null;
  debe_cambiar_password: boolean;
}

