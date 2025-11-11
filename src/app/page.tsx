// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  GraduationCap,
  Library,
  Terminal as TerminalIcon,
  Shield,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TerminalContainer } from '@/components/terminal/TerminalContainer';
import { ScenarioList } from '@/components/scenarios/ScenarioList';
import { ResourceLibrary } from '@/components/resources/ResourceLibrary';
import { Glossary } from '@/components/glossary/Glossary';
import { AdminPanel } from '@/components/admin/AdminPanel';

type Tab = 'glossary' | 'training' | 'resources' | 'terminal' | 'admin';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('glossary');

  const tabs = [
    {
      id: 'glossary' as Tab,
      icon: BookOpen,
      label: 'Inicio (Glosario)',
      color: 'text-blue-400',
    },
    {
      id: 'training' as Tab,
      icon: GraduationCap,
      label: 'Capacitación SOC',
      color: 'text-green-400',
    },
    {
      id: 'resources' as Tab,
      icon: Library,
      label: 'Recursos',
      color: 'text-purple-400',
    },
    {
      id: 'terminal' as Tab,
      icon: TerminalIcon,
      label: 'Terminal',
      color: 'text-yellow-400',
    },
  ];

  // Add admin tab if user is admin or instructor
  if (user && (user.role === 'admin' || user.role === 'instructor')) {
    tabs.push({
      id: 'admin' as Tab,
      icon: Settings,
      label: 'Admin',
      color: 'text-red-400',
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cv-dark-green via-cv-olive to-accent-dark bg-[length:400%_400%] animate-gradient-shift">
      {/* Header */}
      <header className="glass-morphism shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="p-2 bg-gray-900/50 rounded-lg shadow-lg flex-shrink-0">
                <Shield className="h-10 w-10 md:h-12 md:w-12 text-cv-gold" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">CYBER VALTORIX</h1>
                <p className="text-yellow-200 text-xs sm:text-sm font-medium">
                  Taller de Inducción SOC
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <div className="bg-gradient-to-r from-cv-gold to-yellow-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg font-bold text-sm sm:text-base transition-all duration-300 hover:shadow-xl hover:brightness-110 hover:-translate-y-0.5 cursor-pointer">
                {user ? user.name : 'CISO INSTRUCTOR'}
              </div>
              <p className="text-yellow-200 text-xs mt-1">
                Nivel: {user?.role === 'admin' ? 'Admin' : user?.role === 'instructor' ? 'Instructor' : 'Pasante'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-cv-dark-green to-cv-gold transition-all duration-500" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-8 mt-4 md:mt-8">
        {/* Navigation Tabs */}
        <div className="mb-8 sticky top-20 md:top-24 z-40 -mx-4 px-4 py-3 bg-cv-dark-green/90 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none md:-mx-0 md:px-0 md:py-0">
          <nav
            className="flex overflow-x-auto whitespace-nowrap space-x-3 md:flex-wrap md:gap-3 md:space-x-0"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-3 md:px-6 md:py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-cv-dark-green to-cv-gold text-white shadow-lg shadow-cv-gold/40 transform -translate-y-1'
                      : 'bg-cv-olive/60 text-gray-300 hover:bg-cv-gold/20 hover:border-cv-gold border border-cv-gold/20'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : tab.color}`} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-morphism p-6 md:p-8 rounded-2xl shadow-2xl"
          >
            {activeTab === 'glossary' && <Glossary />}
            {activeTab === 'training' && <ScenarioList />}
            {activeTab === 'resources' && <ResourceLibrary />}
            {activeTab === 'terminal' && <TerminalContainer />}
            {activeTab === 'admin' && user && (user.role === 'admin' || user.role === 'instructor') && (
              <AdminPanel />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 px-4 mt-16">
        <div className="glass-morphism rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-white text-sm font-medium mb-2">CYBER VALTORIX S.A. DE C.V.</p>
          <p className="text-gray-400 text-xs">
            Plataforma de Inducción del Centro de Operaciones de Seguridad (SOC)
          </p>
          <p className="text-gray-500 text-xs mt-2">v2.0 - React Platform</p>
        </div>
      </footer>
    </div>
  );
}
