export interface Recurso {
  id?: string;
  numero_inventario: string;
  tipo_recurso: string;
  serie?: string;
  marca?: string;
  modelo?: string;
  color: string;
  fecha_adquisicion: string;
  valor: number;
  grupal: string;
  departamento: string;
  baja: 'Sí' | 'No' | 'En proceso';
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface FilterOptions {
  numero_inventario?: string;
  tipo_recurso?: string;
  serie?: string;
  marca?: string;
  modelo?: string;
  color?: string;
  fecha_adquisicion?: string;
  valor?: string;
  grupal?: string;
  departamento?: string;
  baja?: string;
}