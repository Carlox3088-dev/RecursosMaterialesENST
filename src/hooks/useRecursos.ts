import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Recurso, FilterOptions } from '../types';

export function useRecursos() {
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecursos = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('recursos_materiales')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value.trim() !== '') {
            if (key === 'valor') {
              query = query.eq(key, parseFloat(value));
            } else {
              query = query.ilike(key, `%${value}%`);
            }
          }
        });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setRecursos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addRecurso = async (recurso: Omit<Recurso, 'id'>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('recursos_materiales')
        .insert([recurso])
        .select()
        .single();

      if (error) throw error;
      
      setRecursos(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      setError(error);
      return { data: null, error };
    }
  };

  const updateRecurso = async (id: string, updates: Partial<Recurso>) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('recursos_materiales')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setRecursos(prev => prev.map(r => r.id === id ? data : r));
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      setError(error);
      return { data: null, error };
    }
  };

  const deleteRecurso = async (id: string) => {
    try {
      setError(null);
      const { error } = await supabase
        .from('recursos_materiales')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRecursos(prev => prev.filter(r => r.id !== id));
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Error desconocido';
      setError(error);
      return { error };
    }
  };

  useEffect(() => {
    fetchRecursos();
  }, []);

  return {
    recursos,
    loading,
    error,
    fetchRecursos,
    addRecurso,
    updateRecurso,
    deleteRecurso,
  };
}