import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FilterPanel } from '../Recursos/FilterPanel';
import { RecursosTable } from '../Recursos/RecursosTable';
import { RecursoForm } from '../Recursos/RecursoForm';
import { ExportOptions } from '../Recursos/ExportOptions';
import { useRecursos } from '../../hooks/useRecursos';
import { Recurso, FilterOptions } from '../../types';

export function Dashboard() {
  const { 
    recursos, 
    loading, 
    error, 
    fetchRecursos, 
    addRecurso, 
    updateRecurso, 
    deleteRecurso 
  } = useRecursos();
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showForm, setShowForm] = useState(false);
  const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    fetchRecursos(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    fetchRecursos();
  };

  const handleAddRecurso = () => {
    setEditingRecurso(null);
    setShowForm(true);
  };

  const handleEditRecurso = (recurso: Recurso) => {
    setEditingRecurso(recurso);
    setShowForm(true);
  };

  const handleDeleteRecurso = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este recurso?')) {
      await deleteRecurso(id);
    }
  };

  const handleFormSubmit = async (recursoData: Omit<Recurso, 'id'> | Partial<Recurso>) => {
    if (editingRecurso && editingRecurso.id) {
      await updateRecurso(editingRecurso.id, recursoData);
    } else {
      await addRecurso(recursoData as Omit<Recurso, 'id'>);
    }
    setShowForm(false);
    setEditingRecurso(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecurso(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Recursos Materiales</h2>
            <p className="text-gray-600 mt-1">
              Total de recursos: {recursos.length}
            </p>
          </div>
          <button
            onClick={handleAddRecurso}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Recurso
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
          
          <RecursosTable
            recursos={recursos}
            loading={loading}
            onEdit={handleEditRecurso}
            onDelete={handleDeleteRecurso}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ExportOptions recursos={recursos} />
        </div>
      </div>

      <RecursoForm
        recurso={editingRecurso}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}