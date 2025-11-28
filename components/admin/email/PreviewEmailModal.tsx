'use client';

import { useState, useMemo } from 'react';
import { EmailTemplate } from '@/lib/services/emailTemplateService';
import { substituteVariables, generateSampleData } from '@/lib/email/variable-substitution';

interface PreviewEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate;
}

export function PreviewEmailModal({ isOpen, onClose, template }: PreviewEmailModalProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Generate sample data from the template's schema
  const sampleData = useMemo(() => {
    if (template.data_schema && Object.keys(template.data_schema).length > 0) {
      return generateSampleData(template.data_schema);
    }
    // Fallback for templates without schema
    return {};
  }, [template.data_schema]);

  const previewHtml = useMemo(() => {
    return substituteVariables(template.html_template, sampleData);
  }, [template.html_template, sampleData]);

  const previewSubject = useMemo(() => {
    return substituteVariables(template.subject_template, sampleData);
  }, [template.subject_template, sampleData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Email Preview</h2>
            <p className="text-sm text-gray-600 mt-1">
              {template.description || template.template_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                viewMode === 'desktop'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                viewMode === 'mobile'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Mobile
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Using sample data for preview
          </div>
        </div>

        {/* Subject Line */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Subject</div>
          <div className="font-medium text-gray-900">{previewSubject}</div>
          {template.preheader && (
            <>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 mt-3">Preheader</div>
              <div className="text-sm text-gray-700">{template.preheader}</div>
            </>
          )}
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className={`mx-auto bg-white shadow-lg ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
            <iframe
              srcDoc={previewHtml}
              className="w-full border-0"
              style={{ height: '600px' }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 space-y-3">
          {/* Sample Data Preview */}
          {Object.keys(sampleData).length > 0 && (
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                View sample data used in preview
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-auto text-gray-600 max-h-48">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            </details>
          )}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
