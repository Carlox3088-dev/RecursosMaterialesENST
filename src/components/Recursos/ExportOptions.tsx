import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Recurso } from '../../types';

interface ExportOptionsProps {
  recursos: Recurso[];
}

export function ExportOptions({ recursos }: ExportOptionsProps) {
  const [exportType, setExportType] = useState<'all' | 'type' | 'department'>('all');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const uniqueTypes = [...new Set(recursos.map(r => r.tipo_recurso))];
  const uniqueDepartments = [...new Set(recursos.map(r => r.departamento))];

  const exportToExcel = () => {
    let dataToExport = recursos;

    // Filter based on export type
    switch (exportType) {
      case 'type':
        if (selectedType) {
          dataToExport = recursos.filter(r => r.tipo_recurso === selectedType);
        }
        break;
      case 'department':
        if (selectedDepartment) {
          dataToExport = recursos.filter(r => r.departamento === selectedDepartment);
        }
        break;
      default:
        dataToExport = recursos;
    }

    // Prepare data for Excel export
    const excelData = dataToExport.map(recurso => ({
      'Número de Inventario': recurso.numero_inventario,
      'Tipo de Recurso': recurso.tipo_recurso,
      'Serie': recurso.serie || '',
      'Marca': recurso.marca || '',
      'Modelo': recurso.modelo || '',
      'Color': recurso.color,
      'Fecha de Adquisición': new Date(recurso.fecha_adquisicion).toLocaleDateString('es-ES'),
      'Valor': recurso.valor,
      'Grupal': recurso.grupal,
      'Departamento': recurso.departamento,
      'Estado de Baja': recurso.baja,
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recursos Materiales');

    // Generate filename
    let filename = 'recursos_materiales_enst';
    switch (exportType) {
      case 'type':
        filename += `_${selectedType.replace(/\s+/g, '_')}`;
        break;
      case 'department':
        filename += `_${selectedDepartment.replace(/\s+/g, '_')}`;
        break;
    }
    filename += `_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  const canExport = () => {
    switch (exportType) {
      case 'type':
        return selectedType !== '';
      case 'department':
        return selectedDepartment !== '';
      default:
        return true;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileSpreadsheet className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Exportar a Excel</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Exportación
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="all"
                checked={exportType === 'all'}
                onChange={(e) => setExportType(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Todos los recursos</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="type"
                checked={exportType === 'type'}
                onChange={(e) => setExportType(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Por tipo de recurso</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="exportType"
                value="department"
                checked={exportType === 'department'}
                onChange={(e) => setExportType(e.target.value as any)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Por departamento</span>
            </label>
          </div>
        </div>

        {exportType === 'type' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Tipo de Recurso
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar tipo...</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {exportType === 'department' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccionar Departamento
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccionar departamento...</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={exportToExcel}
          disabled={!canExport()}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar a Excel
        </button>
      </div>
    </div>
  );
}