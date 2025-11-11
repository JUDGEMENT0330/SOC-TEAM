// src/components/admin/CommandEditor.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Terminal, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CommandTemplate } from '@/types';
import toast from 'react-hot-toast';

export const CommandEditor: React.FC = () => {
  const [commands, setCommands] = useState<CommandTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommand, setEditingCommand] = useState<Partial<CommandTemplate> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = async () => {
    try {
      const { data, error } = await supabase
        .from('command_templates')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      setCommands(
        data.map((cmd) => ({
          ...cmd,
          parameters: cmd.parameters || [],
          examples: cmd.examples || [],
        }))
      );
    } catch (error) {
      console.error('Error loading commands:', error);
      toast.error('Failed to load commands');
    } finally {
      setLoading(false);
    }
  };

  const startCreating = () => {
    setEditingCommand({
      name: '',
      command: '',
      description: '',
      category: 'network',
      parameters: [],
      examples: [],
    });
    setIsCreating(true);
  };

  const saveCommand = async () => {
    if (!editingCommand) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (isCreating) {
        const { error } = await supabase.from('command_templates').insert([
          {
            ...editingCommand,
            created_by: user.id,
          },
        ]);

        if (error) throw error;
        toast.success('Command created successfully!');
      } else if (editingCommand.id) {
        const { error } = await supabase
          .from('command_templates')
          .update(editingCommand)
          .eq('id', editingCommand.id);

        if (error) throw error;
        toast.success('Command updated successfully!');
      }

      setEditingCommand(null);
      setIsCreating(false);
      loadCommands();
    } catch (error) {
      console.error('Error saving command:', error);
      toast.error('Failed to save command');
    }
  };

  const deleteCommand = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar este comando?')) return;

    try {
      const { error } = await supabase.from('command_templates').delete().eq('id', id);

      if (error) throw error;

      toast.success('Command deleted successfully!');
      loadCommands();
    } catch (error) {
      console.error('Error deleting command:', error);
      toast.error('Failed to delete command');
    }
  };

  const categories = ['network', 'security', 'system', 'forensics', 'dns', 'analysis'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cv-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-7 h-7 text-cv-gold" />
          Editor de Comandos
        </h3>
        <button
          onClick={startCreating}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cv-dark-green to-cv-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Comando
        </button>
      </div>

      {/* Command List */}
      <div className="space-y-4">
        {commands.map((cmd) => (
          <div
            key={cmd.id}
            className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6 hover:border-cv-gold/60 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">{cmd.name}</h4>
                <code className="text-cv-gold bg-primary-dark px-2 py-1 rounded text-sm">
                  {cmd.command}
                </code>
                <p className="text-gray-300 text-sm mt-2">{cmd.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => {
                    setEditingCommand(cmd);
                    setIsCreating(false);
                  }}
                  className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCommand(cmd.id)}
                  className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-cv-gold/20 text-cv-gold rounded-full text-xs">
                {cmd.category}
              </span>
              {cmd.parameters.length > 0 && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  {cmd.parameters.length} parámetros
                </span>
              )}
            </div>

            {cmd.examples.length > 0 && (
              <div className="mt-4 bg-primary-dark/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2">Ejemplos:</p>
                {cmd.examples.map((example, i) => (
                  <code key={i} className="block text-sm text-gray-300 mb-1">
                    $ {example}
                  </code>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {commands.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Terminal className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay comandos configurados</p>
        </div>
      )}

      {/* Edit/Create Modal */}
      {editingCommand && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            className="bg-cv-dark-green border-2 border-cv-gold rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {isCreating ? 'Nuevo Comando' : 'Editar Comando'}
              </h3>
              <button
                onClick={() => {
                  setEditingCommand(null);
                  setIsCreating(false);
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">Nombre</label>
                <input
                  type="text"
                  value={editingCommand.name}
                  onChange={(e) =>
                    setEditingCommand((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
                  placeholder="ej. Ping Command"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">Comando</label>
                <input
                  type="text"
                  value={editingCommand.command}
                  onChange={(e) =>
                    setEditingCommand((prev) => ({ ...prev, command: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white font-mono focus:border-cv-gold focus:outline-none"
                  placeholder="ej. ping [ip]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">Descripción</label>
                <textarea
                  value={editingCommand.description}
                  onChange={(e) =>
                    setEditingCommand((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
                  placeholder="Descripción del comando..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">Categoría</label>
                <select
                  value={editingCommand.category}
                  onChange={(e) =>
                    setEditingCommand((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">
                  Ejemplos (uno por línea)
                </label>
                <textarea
                  value={(editingCommand.examples || []).join('\n')}
                  onChange={(e) =>
                    setEditingCommand((prev) => ({
                      ...prev,
                      examples: e.target.value.split('\n').filter(Boolean),
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white font-mono focus:border-cv-gold focus:outline-none"
                  placeholder="ping 8.8.8.8&#10;ping google.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setEditingCommand(null);
                    setIsCreating(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCommand}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cv-dark-green to-cv-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
