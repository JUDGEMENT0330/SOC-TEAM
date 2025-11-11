// src/components/admin/AdminPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Users,
  BarChart3,
  Terminal as TerminalIcon,
  Shield,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminStats } from '@/types';
import { ScenarioUploader } from './ScenarioUploader';
import { CommandEditor } from './CommandEditor';
import { StudentDashboard } from './StudentDashboard';

type AdminTab = 'overview' | 'scenarios' | 'students' | 'commands';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load total students
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Load total scenarios
      const { count: scenarioCount } = await supabase
        .from('scenarios')
        .select('*', { count: 'exact', head: true });

      // Load active students (students with progress in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activeProgress } = await supabase
        .from('student_progress')
        .select('user_id')
        .gte('updated_at', sevenDaysAgo.toISOString());

      const activeStudents = new Set(activeProgress?.map((p) => p.user_id) || []).size;

      // Calculate completion rate
      const { data: allProgress } = await supabase
        .from('student_progress')
        .select('status');

      const completed = allProgress?.filter((p) => p.status === 'completed').length || 0;
      const total = allProgress?.length || 1;
      const completionRate = Math.round((completed / total) * 100);

      // Calculate average score
      const { data: scores } = await supabase
        .from('student_progress')
        .select('score')
        .not('score', 'is', null);

      const averageScore = scores?.length
        ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / scores.length)
        : 0;

      // Load scenario stats
      const { data: scenarios } = await supabase
        .from('scenarios')
        .select('id, title');

      const scenarioStats = await Promise.all(
        (scenarios || []).map(async (scenario) => {
          const { data: progress } = await supabase
            .from('student_progress')
            .select('status, time_spent, score')
            .eq('scenario_id', scenario.id);

          const completions = progress?.filter((p) => p.status === 'completed').length || 0;
          const avgTime = progress?.length
            ? Math.round(
                progress.reduce((sum, p) => sum + (p.time_spent || 0), 0) / progress.length
              )
            : 0;
          const avgScore = progress?.length
            ? Math.round(
                progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length
              )
            : 0;

          return {
            scenarioId: scenario.id,
            title: scenario.title,
            completions,
            averageTime: avgTime,
            averageScore: avgScore,
          };
        })
      );

      setStats({
        totalStudents: studentCount || 0,
        totalScenarios: scenarioCount || 0,
        activeStudents,
        completionRate,
        averageScore,
        scenarioStats,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Vista General', icon: BarChart3 },
    { id: 'scenarios' as AdminTab, label: 'Escenarios', icon: Upload },
    { id: 'students' as AdminTab, label: 'Estudiantes', icon: Users },
    { id: 'commands' as AdminTab, label: 'Comandos', icon: TerminalIcon },
  ];

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
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-cv-gold" />
          Panel de Administración
        </h2>
        <p className="text-base md:text-lg text-gray-300">
          Gestión de escenarios, estudiantes y contenido
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cv-gold text-white shadow-lg'
                  : 'bg-cv-olive/30 text-gray-300 hover:bg-cv-olive/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Total Estudiantes"
                value={stats?.totalStudents || 0}
                color="blue"
              />
              <StatCard
                icon={Shield}
                label="Total Escenarios"
                value={stats?.totalScenarios || 0}
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                label="Estudiantes Activos"
                value={stats?.activeStudents || 0}
                color="purple"
              />
              <StatCard
                icon={Award}
                label="Tasa de Completado"
                value={`${stats?.completionRate || 0}%`}
                color="yellow"
              />
            </div>

            {/* Average Score */}
            <div className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cv-gold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Puntuación Promedio
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-white">{stats?.averageScore || 0}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-900/50 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-cv-gold to-yellow-500 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${stats?.averageScore || 0}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-2">de 100 puntos</p>
                </div>
              </div>
            </div>

            {/* Scenario Stats */}
            <div className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-cv-gold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Estadísticas por Escenario
              </h3>
              <div className="space-y-4">
                {stats?.scenarioStats.map((scenario) => (
                  <div
                    key={scenario.scenarioId}
                    className="bg-primary-dark/50 border border-cv-gold/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{scenario.title}</h4>
                      <span className="text-cv-gold font-bold">{scenario.completions} completados</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4" />
                        Tiempo promedio: {scenario.averageTime} min
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Award className="w-4 h-4" />
                        Puntuación promedio: {scenario.averageScore}
                      </div>
                    </div>
                  </div>
                ))}

                {(!stats?.scenarioStats || stats.scenarioStats.length === 0) && (
                  <p className="text-center text-gray-400 py-8">No hay datos disponibles</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && <ScenarioUploader />}
        {activeTab === 'students' && <StudentDashboard />}
        {activeTab === 'commands' && <CommandEditor />}
      </motion.div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cv-gold/20 transition-all">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
};
