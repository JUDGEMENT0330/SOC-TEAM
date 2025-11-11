// src/components/scenarios/ScenarioList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ShieldAlert,
  Network,
  BrainCircuit,
  ShieldOff,
  Swords,
  CheckCircle,
  Clock,
  ChevronDown,
  Play,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Scenario, StudentProgress } from '@/types';
import toast from 'react-hot-toast';

export const ScenarioList: React.FC = () => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [progress, setProgress] = useState<Record<string, StudentProgress>>({});
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenarios();
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setScenarios(
        data.map((s) => ({
          ...s,
          createdAt: new Date(s.created_at),
          updatedAt: new Date(s.updated_at),
        }))
      );
    } catch (error) {
      console.error('Error loading scenarios:', error);
      toast.error('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const progressMap: Record<string, StudentProgress> = {};
      data.forEach((p) => {
        progressMap[p.scenario_id] = {
          ...p,
          startedAt: p.started_at ? new Date(p.started_at) : undefined,
          completedAt: p.completed_at ? new Date(p.completed_at) : undefined,
        };
      });

      setProgress(progressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const startScenario = async (scenarioId: string) => {
    if (!user) {
      toast.error('Please log in to start scenarios');
      return;
    }

    try {
      const existingProgress = progress[scenarioId];

      if (!existingProgress) {
        // Create new progress entry
        const { error } = await supabase.from('student_progress').insert([
          {
            user_id: user.id,
            scenario_id: scenarioId,
            status: 'in_progress',
            started_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        toast.success('Scenario started!');
        await loadProgress();
      } else {
        // Already started, just expand it
        setExpandedScenario(expandedScenario === scenarioId ? null : scenarioId);
      }
    } catch (error) {
      console.error('Error starting scenario:', error);
      toast.error('Failed to start scenario');
    }
  };

  const getScenarioIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'osi':
      case 'tcp-ip':
        return Layers;
      case 'dns':
        return ShieldAlert;
      case 'subnetting':
        return Network;
      case 'incidente':
        return BrainCircuit;
      case 'recuperación':
        return ShieldOff;
      case 'pentesting':
        return Swords;
      default:
        return Layers;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusBadge = (scenarioId: string) => {
    const p = progress[scenarioId];
    if (!p) {
      return (
        <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs sm:text-sm border border-gray-500/30">
          Pendiente
        </span>
      );
    }

    switch (p.status) {
      case 'in_progress':
        return (
          <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs sm:text-sm border border-blue-500/30">
            En Progreso ({p.progress}%)
          </span>
        );
      case 'completed':
        return (
          <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs sm:text-sm border border-green-500/30 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Completado
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cv-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Talleres de Operaciones de Seguridad (SOC)
        </h2>
        <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
          DE: CISO, CYBER VALTORIX S.A. DE C.V.
        </p>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
          <Play className="h-6 w-6" />
          Instrucciones de los Talleres
        </h3>
        <p className="text-gray-300">
          Tienen tiempo asignado para completar estos escenarios. Los documentos en la pestaña
          "Recursos" son su base teórica. Esta es la aplicación práctica.
        </p>
        <p className="text-gray-300 mt-2">
          No busquen "la respuesta correcta". Quiero su análisis, su proceso de pensamiento y las
          acciones de contención que proponen. Usen el modelo "Maestro/Estudiante": preparen su
          solución y estén listos para defenderla.
        </p>
      </motion.div>

      {/* Scenario Cards */}
      <div className="space-y-4">
        {scenarios.map((scenario, index) => {
          const Icon = getScenarioIcon(scenario.category);
          const isExpanded = expandedScenario === scenario.id;

          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cv-dark-green/40 backdrop-blur-lg border-2 border-cv-gold/30 rounded-xl overflow-hidden hover:border-cv-gold/60 transition-all duration-300 hover:shadow-lg hover:shadow-cv-gold/20"
            >
              {/* Scenario Header */}
              <div
                className="p-4 md:p-6 cursor-pointer"
                onClick={() => setExpandedScenario(isExpanded ? null : scenario.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-cv-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-cv-gold" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg">{scenario.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${getDifficultyColor(scenario.difficulty)}`}
                        >
                          {scenario.difficulty}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {scenario.estimatedTime} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-2">
                    {getStatusBadge(scenario.id)}
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Scenario Content (Expanded) */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-cv-gold/30 p-6 bg-cv-olive/20"
                >
                  {/* Progress Bar */}
                  {progress[scenario.id] && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Progreso del Escenario</span>
                        <span className="text-sm font-bold text-cv-gold">
                          {progress[scenario.id].progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-900/50 rounded-full h-2.5">
                        <div
                          className="bg-cv-gold h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress[scenario.id].progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-gray-300 mb-4">{scenario.description}</p>

                  {/* Situation */}
                  <div className="bg-primary-dark/50 border border-cv-gold/20 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-cv-gold mb-2">Situación:</h5>
                    <p className="text-gray-300">{scenario.content.situation}</p>
                  </div>

                  {/* Objectives */}
                  {scenario.content.objectives.length > 0 && (
                    <div className="bg-primary-dark/50 border border-cv-gold/20 rounded-lg p-4 mb-4">
                      <h5 className="font-bold text-cv-gold mb-2">Objetivos:</h5>
                      <ul className="space-y-2">
                        {scenario.content.objectives.map((obj, i) => (
                          <li key={i} className="text-gray-300 flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Deliverables */}
                  {scenario.content.deliverables.length > 0 && (
                    <div className="bg-primary-dark/50 border border-cv-gold/20 rounded-lg p-4">
                      <h5 className="font-bold text-cv-gold mb-2">Entregables:</h5>
                      <ul className="space-y-2">
                        {scenario.content.deliverables.map((del, i) => (
                          <li key={i} className="text-gray-300 flex items-start gap-2">
                            <span className="text-cv-gold mt-1">→</span>
                            {del}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6 flex justify-end">
                    {!progress[scenario.id] ? (
                      <button
                        onClick={() => startScenario(scenario.id)}
                        className="px-6 py-3 bg-gradient-to-r from-cv-dark-green to-cv-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Iniciar Escenario
                      </button>
                    ) : progress[scenario.id].status === 'completed' ? (
                      <button className="px-6 py-3 bg-green-500/20 text-green-300 font-semibold rounded-lg border border-green-500/30 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Completado
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          /* Navigate to terminal or scenario detail */
                        }}
                        className="px-6 py-3 bg-blue-500/20 text-blue-300 font-semibold rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Continuar
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {scenarios.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <ShieldAlert className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay escenarios disponibles</p>
          <p className="text-sm mt-2">Los instructores pueden agregar escenarios desde el panel de administración</p>
        </div>
      )}
    </div>
  );
};
