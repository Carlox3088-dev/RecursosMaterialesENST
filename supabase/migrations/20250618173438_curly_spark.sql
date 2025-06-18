/*
  # Schema completo para Recursos Materiales ENST

  1. Nuevas Tablas
    - `recursos_materiales`
      - `id` (uuid, primary key)
      - `numero_inventario` (text, unique, required)
      - `tipo_recurso` (text, required)
      - `serie` (text, optional)
      - `marca` (text, optional)
      - `modelo` (text, optional)
      - `color` (text, required)
      - `fecha_adquisicion` (date, required)
      - `valor` (numeric, required)
      - `grupal` (text, required)
      - `departamento` (text, required)
      - `baja` (text, required - 'Sí', 'No', 'En proceso')
      - `created_at` (timestamptz, auto)
      - `updated_at` (timestamptz, auto)

  2. Seguridad
    - Habilitar RLS en la tabla `recursos_materiales`
    - Políticas para usuarios autenticados para CRUD completo
    - Función para actualizar automáticamente `updated_at`

  3. Índices
    - Índice en `numero_inventario` para búsquedas rápidas
    - Índice en `tipo_recurso` para filtrado
    - Índice en `departamento` para filtrado
    - Índice compuesto para búsquedas complejas

  4. Datos de ejemplo
    - Algunos registros de muestra para testing
*/

-- Crear la tabla principal de recursos materiales
CREATE TABLE IF NOT EXISTS recursos_materiales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_inventario text UNIQUE NOT NULL,
  tipo_recurso text NOT NULL,
  serie text,
  marca text,
  modelo text,
  color text NOT NULL,
  fecha_adquisicion date NOT NULL,
  valor numeric(10,2) NOT NULL CHECK (valor >= 0),
  grupal text NOT NULL,
  departamento text NOT NULL,
  baja text NOT NULL CHECK (baja IN ('Sí', 'No', 'En proceso')) DEFAULT 'No',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE recursos_materiales ENABLE ROW LEVEL SECURITY;

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_recursos_materiales_updated_at ON recursos_materiales;
CREATE TRIGGER update_recursos_materiales_updated_at
  BEFORE UPDATE ON recursos_materiales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad para usuarios autenticados
CREATE POLICY "Los usuarios autenticados pueden ver todos los recursos"
  ON recursos_materiales
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Los usuarios autenticados pueden insertar recursos"
  ON recursos_materiales
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Los usuarios autenticados pueden actualizar recursos"
  ON recursos_materiales
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Los usuarios autenticados pueden eliminar recursos"
  ON recursos_materiales
  FOR DELETE
  TO authenticated
  USING (true);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_recursos_numero_inventario 
  ON recursos_materiales (numero_inventario);

CREATE INDEX IF NOT EXISTS idx_recursos_tipo_recurso 
  ON recursos_materiales (tipo_recurso);

CREATE INDEX IF NOT EXISTS idx_recursos_departamento 
  ON recursos_materiales (departamento);

CREATE INDEX IF NOT EXISTS idx_recursos_baja 
  ON recursos_materiales (baja);

CREATE INDEX IF NOT EXISTS idx_recursos_fecha_adquisicion 
  ON recursos_materiales (fecha_adquisicion);

-- Índice compuesto para búsquedas complejas
CREATE INDEX IF NOT EXISTS idx_recursos_search 
  ON recursos_materiales (tipo_recurso, departamento, baja);

-- Índices para búsquedas de texto (usando gin para búsquedas más eficientes)
CREATE INDEX IF NOT EXISTS idx_recursos_text_search 
  ON recursos_materiales USING gin (
    to_tsvector('spanish', 
      coalesce(numero_inventario, '') || ' ' ||
      coalesce(tipo_recurso, '') || ' ' ||
      coalesce(serie, '') || ' ' ||
      coalesce(marca, '') || ' ' ||
      coalesce(modelo, '') || ' ' ||
      coalesce(color, '') || ' ' ||
      coalesce(grupal, '') || ' ' ||
      coalesce(departamento, '')
    )
  );

-- Insertar datos de ejemplo para testing
INSERT INTO recursos_materiales (
  numero_inventario, tipo_recurso, serie, marca, modelo, color, 
  fecha_adquisicion, valor, grupal, departamento, baja
) VALUES 
  ('INV-001', 'Computadora', 'ABC123', 'Dell', 'OptiPlex 7090', 'Negro', '2023-01-15', 850.00, 'Informática', 'Administración', 'No'),
  ('INV-002', 'Monitor', 'MON456', 'Samsung', 'F24T450FQU', 'Negro', '2023-01-15', 180.00, 'Informática', 'Administración', 'No'),
  ('INV-003', 'Impresora', 'HP789', 'HP', 'LaserJet Pro M404n', 'Blanco', '2023-02-10', 220.00, 'Oficina', 'Secretaría', 'No'),
  ('INV-004', 'Silla', '', 'Steelcase', 'Think', 'Azul', '2023-03-05', 320.00, 'Mobiliario', 'Dirección', 'No'),
  ('INV-005', 'Proyector', 'PROJ001', 'Epson', 'EB-X41', 'Blanco', '2022-09-20', 450.00, 'Audiovisual', 'Aula 101', 'En proceso'),
  ('INV-006', 'Pizarra Digital', 'PD2023', 'Smart', 'Board MX275', 'Negro', '2023-04-12', 1200.00, 'Educativo', 'Aula 102', 'No'),
  ('INV-007', 'Mesa', '', 'IKEA', 'BEKANT', 'Blanco', '2023-01-20', 85.00, 'Mobiliario', 'Sala de Profesores', 'No'),
  ('INV-008', 'Teléfono', 'TEL456', 'Cisco', 'IP Phone 7841', 'Negro', '2023-02-28', 95.00, 'Comunicaciones', 'Recepción', 'No'),
  ('INV-009', 'Aire Acondicionado', 'AC2023', 'Mitsubishi', 'MSZ-AP35VG', 'Blanco', '2023-06-15', 680.00, 'Climatización', 'Biblioteca', 'No'),
  ('INV-010', 'Servidor', 'SRV001', 'HPE', 'ProLiant DL380 Gen10', 'Plateado', '2022-11-30', 2500.00, 'Informática', 'Centro de Datos', 'Sí')
ON CONFLICT (numero_inventario) DO NOTHING;

-- Crear vista para estadísticas rápidas
CREATE OR REPLACE VIEW recursos_estadisticas AS
SELECT 
  COUNT(*) as total_recursos,
  COUNT(*) FILTER (WHERE baja = 'No') as recursos_activos,
  COUNT(*) FILTER (WHERE baja = 'Sí') as recursos_dados_baja,
  COUNT(*) FILTER (WHERE baja = 'En proceso') as recursos_en_proceso,
  SUM(valor) as valor_total,
  SUM(valor) FILTER (WHERE baja = 'No') as valor_activo,
  COUNT(DISTINCT departamento) as total_departamentos,
  COUNT(DISTINCT tipo_recurso) as total_tipos_recursos
FROM recursos_materiales;

-- Crear función para búsqueda de texto completo
CREATE OR REPLACE FUNCTION buscar_recursos(termino_busqueda text)
RETURNS TABLE (
  id uuid,
  numero_inventario text,
  tipo_recurso text,
  serie text,
  marca text,
  modelo text,
  color text,
  fecha_adquisicion date,
  valor numeric,
  grupal text,
  departamento text,
  baja text,
  created_at timestamptz,
  updated_at timestamptz,
  relevancia real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.numero_inventario,
    r.tipo_recurso,
    r.serie,
    r.marca,
    r.modelo,
    r.color,
    r.fecha_adquisicion,
    r.valor,
    r.grupal,
    r.departamento,
    r.baja,
    r.created_at,
    r.updated_at,
    ts_rank(
      to_tsvector('spanish', 
        coalesce(r.numero_inventario, '') || ' ' ||
        coalesce(r.tipo_recurso, '') || ' ' ||
        coalesce(r.serie, '') || ' ' ||
        coalesce(r.marca, '') || ' ' ||
        coalesce(r.modelo, '') || ' ' ||
        coalesce(r.color, '') || ' ' ||
        coalesce(r.grupal, '') || ' ' ||
        coalesce(r.departamento, '')
      ),
      plainto_tsquery('spanish', termino_busqueda)
    ) as relevancia
  FROM recursos_materiales r
  WHERE to_tsvector('spanish', 
    coalesce(r.numero_inventario, '') || ' ' ||
    coalesce(r.tipo_recurso, '') || ' ' ||
    coalesce(r.serie, '') || ' ' ||
    coalesce(r.marca, '') || ' ' ||
    coalesce(r.modelo, '') || ' ' ||
    coalesce(r.color, '') || ' ' ||
    coalesce(r.grupal, '') || ' ' ||
    coalesce(r.departamento, '')
  ) @@ plainto_tsquery('spanish', termino_busqueda)
  ORDER BY relevancia DESC;
END;
$$ LANGUAGE plpgsql;

-- Crear función para generar reportes por departamento
CREATE OR REPLACE FUNCTION reporte_por_departamento(dept_nombre text DEFAULT NULL)
RETURNS TABLE (
  departamento text,
  total_recursos bigint,
  recursos_activos bigint,
  recursos_baja bigint,
  recursos_proceso bigint,
  valor_total numeric,
  valor_promedio numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.departamento,
    COUNT(*) as total_recursos,
    COUNT(*) FILTER (WHERE r.baja = 'No') as recursos_activos,
    COUNT(*) FILTER (WHERE r.baja = 'Sí') as recursos_baja,
    COUNT(*) FILTER (WHERE r.baja = 'En proceso') as recursos_proceso,
    SUM(r.valor) as valor_total,
    AVG(r.valor) as valor_promedio
  FROM recursos_materiales r
  WHERE (dept_nombre IS NULL OR r.departamento ILIKE '%' || dept_nombre || '%')
  GROUP BY r.departamento
  ORDER BY valor_total DESC;
END;
$$ LANGUAGE plpgsql;

-- Crear función para generar reportes por tipo de recurso
CREATE OR REPLACE FUNCTION reporte_por_tipo_recurso(tipo_nombre text DEFAULT NULL)
RETURNS TABLE (
  tipo_recurso text,
  total_recursos bigint,
  recursos_activos bigint,
  recursos_baja bigint,
  recursos_proceso bigint,
  valor_total numeric,
  valor_promedio numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.tipo_recurso,
    COUNT(*) as total_recursos,
    COUNT(*) FILTER (WHERE r.baja = 'No') as recursos_activos,
    COUNT(*) FILTER (WHERE r.baja = 'Sí') as recursos_baja,
    COUNT(*) FILTER (WHERE r.baja = 'En proceso') as recursos_proceso,
    SUM(r.valor) as valor_total,
    AVG(r.valor) as valor_promedio
  FROM recursos_materiales r
  WHERE (tipo_nombre IS NULL OR r.tipo_recurso ILIKE '%' || tipo_nombre || '%')
  GROUP BY r.tipo_recurso
  ORDER BY valor_total DESC;
END;
$$ LANGUAGE plpgsql;

-- Comentarios finales
COMMENT ON TABLE recursos_materiales IS 'Tabla principal para almacenar información de recursos materiales de ENST';
COMMENT ON COLUMN recursos_materiales.numero_inventario IS 'Número único de inventario del recurso';
COMMENT ON COLUMN recursos_materiales.baja IS 'Estado de baja del recurso: Sí, No, En proceso';
COMMENT ON COLUMN recursos_materiales.valor IS 'Valor monetario del recurso en euros';
COMMENT ON VIEW recursos_estadisticas IS 'Vista con estadísticas generales de recursos';
COMMENT ON FUNCTION buscar_recursos IS 'Función para búsqueda de texto completo en recursos';
COMMENT ON FUNCTION reporte_por_departamento IS 'Función para generar reportes agrupados por departamento';
COMMENT ON FUNCTION reporte_por_tipo_recurso IS 'Función para generar reportes agrupados por tipo de recurso';