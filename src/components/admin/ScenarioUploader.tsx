// src/components/admin/ScenarioUploader.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
// CORRECCIÓN: Se cambiaron los alias a rutas relativas para resolver el error de compilación.
import { supabase } from '../../lib/supabase';
import { parsePDFScenario } from '../../lib/pdfParser';
import { Scenario } from '@/types';
import toast from 'react-hot-toast';

interface PDFUploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  progress?: number;
}

export const ScenarioUploader: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<PDFUploadStatus>({ status: 'idle' });
  const [parsedScenario, setParsedScenario] = useState<Partial<Scenario> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find((file) => file.type === 'application/pdf');

    if (pdfFile) {
      handleFileUpload(pdfFile);
    } else {
      toast.error('Please upload a PDF file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadStatus({ status: 'uploading', message: 'Uploading PDF...', progress: 0 });

    try {
      // Step 1: Parse PDF
      setUploadStatus({ status: 'processing', message: 'Parsing PDF content...', progress: 30 });
      const pdfData = await parsePDFScenario(file);

      // Step 2: Extract scenario structure using AI/pattern matching
      setUploadStatus({ status: 'processing', message: 'Extracting scenario data...', progress: 60 });
      const scenario = await extractScenarioFromPDF(pdfData);

      setParsedScenario(scenario);
      setUploadStatus({
        status: 'success',
        message: 'PDF processed successfully! Review and save.',
        progress: 100,
      });

      toast.success('PDF processed successfully!');
    } catch (error) {
      console.error('Error processing PDF:', error);
      setUploadStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to process PDF',
      });
      toast.error('Failed to process PDF');
    }
  };

  const extractScenarioFromPDF = async (pdfData: any): Promise<Partial<Scenario>> => {
    // This is a simplified version - in production, you might use:
    // 1. OpenAI API for intelligent extraction
    // 2. Pattern matching for structured PDFs
    // 3. Manual field mapping interface

    const content = pdfData.content.toLowerCase();

    // Extract title (usually first line or after "Title:")
    const titleMatch = content.match(/title:\s*(.+)/i) || content.match(/^(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Untitled Scenario';

    // Extract difficulty
    let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate';
    if (content.includes('beginner') || content.includes('principiante')) {
      difficulty = 'beginner';
    } else if (content.includes('advanced') || content.includes('avanzado')) {
      difficulty = 'advanced';
    }

    // Extract estimated time
    const timeMatch = content.match(/(\d+)\s*(minutos|minutes|mins)/i);
    const estimatedTime = timeMatch ? parseInt(timeMatch[1]) : 30;

    // Extract objectives (lines starting with numbers or bullets)
    const objectives = content
      .split('\n')
      // CORRECCIÓN: Se añadió (line: string) para evitar el error de 'any' implícito.
      .filter((line: string) => /^\d+\.|^-|^•/.test(line.trim()))
      // CORRECCIÓN: Se añadió (line: string)
      .map((line: string) => line.replace(/^\d+\.|^-|^•/, '').trim())
      // CORRECCIÓN: Se añadió (line: string)
      .filter((line: string) => line.length > 10)
      .slice(0, 5);

    return {
      title,
      description: pdfData.content.substring(0, 500),
      difficulty,
      estimatedTime,
      category: 'Imported',
      content: {
        situation: 'Extracted from PDF - Please review and edit',
        objectives: objectives.length > 0 ? objectives : ['Review and add objectives'],
        deliverables: ['Review and add deliverables'],
      },
      commands: [],
    };
  };

  const saveScenario = async () => {
    if (!parsedScenario) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('scenarios').insert([
        {
          ...parsedScenario,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      toast.success('Scenario saved successfully!');
      setParsedScenario(null);
      setUploadStatus({ status: 'idle' });
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast.error('Failed to save scenario');
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`glass-morphism rounded-2xl p-8 border-2 border-dashed transition-all ${
          isDragging
            ? 'border-cv-gold bg-cv-gold/10'
            : 'border-cv-gold/30 hover:border-cv-gold/60'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {uploadStatus.status === 'idle' && (
            <>
              <Upload className="w-16 h-16 text-cv-gold mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Upload Scenario PDF</h3>
              <p className="text-gray-400 mb-4">
                Drag and drop a PDF file here, or click to browse
              </p>
              <label className="px-6 py-3 bg-gradient-to-r from-cv-dark-green to-cv-gold text-white font-semibold rounded-lg cursor-pointer hover:shadow-lg transition-all">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                Select PDF File
              </label>
            </>
          )}

          {uploadStatus.status === 'uploading' && (
            <>
              <Loader2 className="w-16 h-16 text-cv-gold animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{uploadStatus.message}</h3>
              <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cv-gold transition-all duration-300"
                  style={{ width: `${uploadStatus.progress}%` }}
                />
              </div>
            </>
          )}

          {uploadStatus.status === 'processing' && (
            <>
              <Loader2 className="w-16 h-16 text-cv-gold animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{uploadStatus.message}</h3>
              <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cv-gold transition-all duration-300"
                  style={{ width: `${uploadStatus.progress}%` }}
                />
              </div>
            </>
          )}

          {uploadStatus.status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{uploadStatus.message}</h3>
            </>
          )}

          {uploadStatus.status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Error</h3>
              <p className="text-red-400">{uploadStatus.message}</p>
              <button
                onClick={() => setUploadStatus({ status: 'idle' })}
                className="mt-4 px-6 py-2 bg-cv-gold text-white rounded-lg hover:bg-cv-gold/80 transition-all"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview and Edit Parsed Scenario */}
      {parsedScenario && uploadStatus.status === 'success' && (
        <div className="glass-morphism rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-cv-gold" />
              Review Scenario
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setParsedScenario(null);
                  setUploadStatus({ status: 'idle' });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveScenario}
                className="px-4 py-2 bg-gradient-to-r from-cv-dark-green to-cv-gold text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Save Scenario
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cv-gold mb-2">Title</label>
              <input
                type="text"
                value={parsedScenario.title}
                onChange={(e) =>
                  setParsedScenario((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cv-gold mb-2">Description</label>
              <textarea
                value={parsedScenario.description}
                onChange={(e) =>
                  setParsedScenario((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">Difficulty</label>
                <select
                  value={parsedScenario.difficulty}
                  onChange={(e) =>
                    setParsedScenario((prev) => ({
                      ...prev,
                      difficulty: e.target.value as any,
                    }))
                  }
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">
                  Time (minutes)
                </label>
                <input
                  type="number"
                  value={parsedScenario.estimatedTime}
                  onChange={(e) =>
                    setParsedScenario((prev) => ({
                      ...prev,
                      estimatedTime: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cv-gold mb-2">Category</label>
                <input
                  type="text"
                  value={parsedScenario.category}
                  onChange={(e) =>
                    setParsedScenario((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-primary-dark border border-cv-gold/30 rounded-lg text-white focus:border-cv-gold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
