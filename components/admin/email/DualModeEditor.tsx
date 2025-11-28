'use client';

/**
 * DualModeEditor - Code + Preview toggle for email templates
 *
 * Provides:
 * - Code view with syntax highlighting hints
 * - Live HTML preview with variable substitution
 * - Variable insertion toolbar
 * - Validation feedback
 */

import { useState, useMemo } from 'react';
import { substituteVariables, generateSampleData, extractVariables, validateTemplate } from '@/lib/email/variable-substitution';

interface DualModeEditorProps {
  value: string;
  onChange: (value: string) => void;
  schema: Record<string, any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

type EditorMode = 'code' | 'preview' | 'split';

export function DualModeEditor({
  value,
  onChange,
  schema,
  label = 'HTML Template',
  placeholder = '<html>...</html>',
  required = false,
}: DualModeEditorProps) {
  const [mode, setMode] = useState<EditorMode>('split');
  const [showVariables, setShowVariables] = useState(false);

  // Generate sample data from schema for preview
  const sampleData = useMemo(() => generateSampleData(schema), [schema]);

  // Substitute variables for preview
  const previewHtml = useMemo(() => {
    try {
      return substituteVariables(value, sampleData);
    } catch (error) {
      return `<div style="color: red; padding: 20px;">Error rendering preview: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
    }
  }, [value, sampleData]);

  // Validate template
  const validation = useMemo(() => validateTemplate(value, schema), [value, schema]);

  // Extract used variables
  const usedVariables = useMemo(() => extractVariables(value), [value]);

  // Insert variable at cursor
  const insertVariable = (variable: string, formatter?: string) => {
    const textArea = document.getElementById('html-editor') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const insertion = formatter ? `{{${variable}|${formatter}}}` : `{{${variable}}}`;
      const newValue = value.substring(0, start) + insertion + value.substring(end);
      onChange(newValue);

      // Restore cursor position
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + insertion.length, start + insertion.length);
      }, 0);
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'code' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Code
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'split' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Variable Toolbar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowVariables(!showVariables)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Insert Variable
          <svg className={`w-3 h-3 transition-transform ${showVariables ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Validation Badge */}
        {value && (
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            validation.valid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {validation.valid ? `${usedVariables.length} variables` : `${validation.errors.length} issues`}
          </span>
        )}
      </div>

      {/* Variables Dropdown */}
      {showVariables && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">Click to insert at cursor:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(schema).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => insertVariable(key)}
                className="px-2 py-1 text-xs font-mono bg-white border border-gray-300 rounded hover:bg-gray-100 hover:border-gray-400 transition-colors"
              >
                {`{{${key}}}`}
              </button>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">With formatters:</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => insertVariable('amount', 'currency')} className="px-2 py-1 text-xs font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                {'{{amount|currency}}'}
              </button>
              <button type="button" onClick={() => insertVariable('date', 'formatDate')} className="px-2 py-1 text-xs font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                {'{{date|formatDate}}'}
              </button>
              <button type="button" onClick={() => insertVariable('name', 'uppercase')} className="px-2 py-1 text-xs font-mono bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
                {'{{name|uppercase}}'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className={`border border-gray-300 rounded-lg overflow-hidden ${mode === 'split' ? 'grid grid-cols-2' : ''}`}>
        {/* Code Editor */}
        {(mode === 'code' || mode === 'split') && (
          <div className={`${mode === 'split' ? 'border-r border-gray-300' : ''}`}>
            <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">HTML Code</span>
            </div>
            <textarea
              id="html-editor"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-96 px-3 py-2 font-mono text-sm bg-gray-900 text-green-400 focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(mode === 'preview' || mode === 'split') && (
          <div>
            <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">Live Preview</span>
            </div>
            <div className="h-96 overflow-auto bg-white">
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          margin: 0;
                          padding: 16px;
                          font-size: 14px;
                          line-height: 1.5;
                        }
                      </style>
                    </head>
                    <body>
                      ${previewHtml}
                    </body>
                  </html>
                `}
                className="w-full h-full border-0"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {!validation.valid && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-800 mb-1">Template Issues:</p>
          <ul className="text-xs text-yellow-700 list-disc list-inside">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Sample Data Preview */}
      <details className="text-xs">
        <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
          View sample data used in preview
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 rounded-lg overflow-auto text-gray-600">
          {JSON.stringify(sampleData, null, 2)}
        </pre>
      </details>
    </div>
  );
}
