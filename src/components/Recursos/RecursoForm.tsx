import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Recurso } from '../../types';

interface RecursoFormProps {
  recurso?: Recurso | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recurso: Omit<Recurso, 'id'> | Partial<Recurso>) => Promise<void>;
}

export function RecursoForm({ recurso, isOpen, onClose, onSubmit }: RecursoFormProps) {
  const [formData, setFormData] = useState({
    numero_inventario: '',
    tipo_recurso: '',
    serie: '',
    marca: '',
    modelo: '',
    color: '',
    fecha_adquisicion: '',
    valor: '',
    grupal: '',
    departamento: '',
    baja: 'No' as 'Sí' | 'No' | 'En proceso',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recurso) {
      setFormData({
        numero_inventario: recurso.numero_inventario,
        tipo_recurso: recurso.tipo_recurso,
        serie: recurso.serie || '',
        marca: recurso.marca || '',
        modelo: recurso.modelo || '',
        color: recurso.color,
        fecha_adquisicion: recurso.fecha_adquisicion,
        valor: recurso.valor.toString(),
        grupal: recurso.grupal,
        departamento: recurso.departamento,
        baja: recurso.baja,
      });
    } else {
      setFormData({
        numero_inventario: '',
        tipo_recurso: '',
        serie: '',
        marca: '',
        modelo: '',
        color: '',
        fecha_adquisicion: '',
        valor: '',
        grupal: '',
        departamento: '',
        baja: 'No',
      });
    }
  }, [recurso, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        valor: parseFloat(formData.valor),
        serie: formData.serie || null,
        marca: formData.marca || null,
        modelo: formData.modelo || null,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error al guardar recurso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {recurso ? 'Editar Recurso' : 'Agregar Nuevo Recurso'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="numero_inventario" className="block text-sm font-medium text-gray-700 mb-1">
                Número de Inventario *
              </label>
              <input
                type="text"
                id="numero_inventario"
                name="numero_inventario"
                required
                value={formData.numero_inventario}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="tipo_recurso" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Recurso *
              </label>
              <input
                type="text"
                id="tipo_recurso"
                name="tipo_recurso"
                required
                value={formData.tipo_recurso}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="serie" className="block text-sm font-medium text-gray-700 mb-1">
                Serie
              </label>
              <input
                type="text"
                id="serie"
                name="serie"
                value={formData.serie}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="modelo" className="block text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                Color *
              </label>
              <input
                type="text"
                id="color"
                name="color"
                required
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="fecha_adquisicion" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Adquisición *
              </label>
              <input
                type="date"
                id="fecha_adquisicion"
                name="fecha_adquisicion"
                required
                value={formData.fecha_adquisicion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
                Valor *
              </label>
              <input
                type="number"
                id="valor"
                name="valor"
                required
                min="0"
                step="0.01"
                value={formData.valor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="grupal" className="block text-sm font-medium text-gray-700 mb-1">
                Grupal *
              </label>
              <input
                type="text"
                id="grupal"
                name="grupal"
                required
                value={formData.grupal}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                Departamento / Área *
              </label>
              <input
                type="text"
                id="departamento"
                name="departamento"
                required
                value={formData.departamento}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="baja" className="block text-sm font-medium text-gray-700 mb-1">
                Estado de Baja *
              </label>
              <select
                id="baja"
                name="baja"
                required
                value={formData.baja}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="No">No</option>
                <option value="Sí">Sí</option>
                <option value="En proceso">En proceso</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Guardando...' : (recurso ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}