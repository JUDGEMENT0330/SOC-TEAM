// src/components/admin/StudentDashboard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Users, Award, Clock, TrendingUp, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User, StudentProgress } from '@/types';
import toast from 'react-hot-toast';

interface StudentWithProgress extends User {
  progress: StudentProgress[];
  totalScenarios: number;
  completedScenarios: number;
  averageScore: number;
  totalTimeSpent: number;
}

export const StudentDashboard: React.FC = () => {
  const [students, setStudents] = useState<StudentWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithProgress | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // Load all students
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student');

      if (profilesError) throw profilesError;

      // Load progress for each student
      const studentsWithProgress = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: progress } = await supabase
            .from('student_progress')
            .select('*')
            .eq('user_id', profile.id);

          const completedScenarios = progress?.filter((p) => p.status === 'completed').length || 0;
          const totalTimeSpent = progress?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;

          const scores = progress?.filter((p) => p.score !== null).map((p) => p.score!) || [];
          const averageScore = scores.length
            ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
            : 0;

          return {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role as 'student',
            createdAt: new Date(profile.created_at),
            progress: progress || [],
            totalScenarios: progress?.length || 0,
            completedScenarios,
            averageScore,
            totalTimeSpent,
          };
        })
      );

      setStudents(studentsWithProgress);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-cv-gold" />
          Gestión de Estudiantes
        </h3>
        <div className="text-cv-gold font-semibold">
          {students.length} Estudiante{students.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-cv-dark-green/40 backdrop-blur-lg border border-cv-gold/30 rounded-xl p-6 hover:border-cv-gold/60 transition-all cursor-pointer"
            onClick={() => setSelectedStudent(student)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-white">{student.name}</h4>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {student.email}
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3" />
                  Registrado: {student.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cv-gold">{student.averageScore}</div>
                <div className="text-xs text-gray-400">Puntuación</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-primary-dark/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{student.totalScenarios}</div>
                <div className="text-xs text-gray-400">Iniciados</div>
              </div>
              <div className="bg-primary-dark/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-400">{student.completedScenarios}</div>
                <div className="text-xs text-gray-400">Completados</div>
              </div>
              <div className="bg-primary-dark/50 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-400">{student.totalTimeSpent}</div>
                <div className="text-xs text-gray-400">Minutos</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-900/50 rounded-full h-2">
              <div
                className="bg-cv-gold h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    student.totalScenarios
                      ? (student.completedScenarios / student.totalScenarios) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay estudiantes registrados</p>
        </div>
      )}

      {/* Student Detail Modal (if needed) */}
      {selectedStudent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="bg-cv-dark-green border-2 border-cv-gold rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">{selectedStudent.name}</h3>
            <div className="space-y-4">
              {selectedStudent.progress.map((prog) => (
                <div
                  key={prog.scenarioId}
                  className="bg-primary-dark/50 border border-cv-gold/20 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Escenario ID: {prog.scenarioId}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        prog.status === 'completed'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {prog.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-300">
                    <div>Progreso: {prog.progress}%</div>
                    <div>Tiempo: {prog.timeSpent} min</div>
                    <div>Puntuación: {prog.score || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
