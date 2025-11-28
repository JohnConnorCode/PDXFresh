'use client';

import { useState, useMemo } from 'react';
import { saveEmailTemplateDraft, publishEmailTemplate } from '@/lib/actions/emailTemplate';
import { EmailTemplate } from '@/lib/services/emailTemplateService';
import { DualModeEditor } from './DualModeEditor';

interface EditEmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  onSave: () => void;
}

export function EditEmailTemplateModal({ isOpen, onClose, template, onSave }: EditEmailTemplateModalProps) {
  const isNewTemplate = !template;

  const [formData, setFormData] = useState({
    template_name: template?.template_name || '',
    subject_template: template?.subject_template || '',
    html_template: template?.html_template || '',
    preheader: template?.preheader || '',
    category: template?.category || '',
    description: template?.description || '',
    data_schema: JSON.stringify(template?.data_schema || {}, null, 2),
  });

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Parse schema for the DualModeEditor
  const parsedSchema = useMemo(() => {
    try {
      return JSON.parse(formData.data_schema);
    } catch {
      return {};
    }
  }, [formData.data_schema]);

  if (!isOpen) return null;

  const handleSave = async (shouldPublish: boolean = false) => {
    if (shouldPublish) {
      setPublishing(true);
    } else {
      setSaving(true);
    }
    setResult(null);

    try {
      // Validate and parse data_schema
      let dataSchema = {};
      try {
        dataSchema = JSON.parse(formData.data_schema);
      } catch (error) {
        setResult({
          success: false,
          message: 'Invalid JSON in data schema',
        });
        return;
      }

      // Save as draft first
      const draftResponse = await saveEmailTemplateDraft({
        template_name: formData.template_name,
        subject_template: formData.subject_template,
        html_template: formData.html_template,
        preheader: formData.preheader,
        category: formData.category,
        description: formData.description,
        data_schema: dataSchema,
      });

      if (!draftResponse.success) {
        setResult({
          success: false,
          message: draftResponse.error || 'Failed to save draft',
        });
        return;
      }

      // If publishing, publish the draft
      if (shouldPublish) {
        const publishResponse = await publishEmailTemplate(formData.template_name);

        if (!publishResponse.success) {
          setResult({
            success: false,
            message: publishResponse.error || 'Failed to publish template',
          });
          return;
        }

        setResult({
          success: true,
          message: 'Template published successfully!',
        });
      } else {
        setResult({
          success: true,
          message: 'Draft saved successfully!',
        });
      }

      setTimeout(() => {
        onSave();
        onClose();
        setResult(null);
      }, 1500);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      });
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const handleClose = () => {
    if (!saving && !publishing) {
      setResult(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {isNewTemplate ? 'Create New Template' : 'Edit Template'}
          </h2>
          <button
            onClick={handleClose}
            disabled={saving || publishing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Template Name */}
          <div>
            <label htmlFor="template_name" className="block text-sm font-medium text-gray-700 mb-1">
              Template Name * <span className="text-gray-500 text-xs">(lowercase, use underscores)</span>
            </label>
            <input
              type="text"
              id="template_name"
              value={formData.template_name}
              onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
              disabled={!isNewTemplate}
              required
              placeholder="order_confirmation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Order Confirmation Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select a category</option>
              <option value="orders">Orders</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="marketing">Marketing</option>
              <option value="internal">Internal</option>
              <option value="notifications">Notifications</option>
            </select>
          </div>

          {/* Subject Template */}
          <div>
            <label htmlFor="subject_template" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Template * <span className="text-gray-500 text-xs">(use {'{{'} variableName {'}} '} for variables)</span>
            </label>
            <input
              type="text"
              id="subject_template"
              value={formData.subject_template}
              onChange={(e) => setFormData({ ...formData, subject_template: e.target.value })}
              required
              placeholder="Order Confirmation - {{orderNumber}}"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Preheader */}
          <div>
            <label htmlFor="preheader" className="block text-sm font-medium text-gray-700 mb-1">
              Preheader <span className="text-gray-500 text-xs">(preview text shown in inbox)</span>
            </label>
            <input
              type="text"
              id="preheader"
              value={formData.preheader}
              onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
              placeholder="Thank you for your order!"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* HTML Template with Dual-Mode Editor */}
          <DualModeEditor
            value={formData.html_template}
            onChange={(value) => setFormData({ ...formData, html_template: value })}
            schema={parsedSchema}
            label="HTML Template"
            placeholder="<html>...</html>"
            required
          />

          {/* Data Schema */}
          <div>
            <label htmlFor="data_schema" className="block text-sm font-medium text-gray-700 mb-1">
              Data Schema (JSON) <span className="text-gray-500 text-xs">(defines available variables)</span>
            </label>
            <textarea
              id="data_schema"
              value={formData.data_schema}
              onChange={(e) => setFormData({ ...formData, data_schema: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
              placeholder='{"orderNumber": "string", "customerName": "string"}'
            />
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {result.message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving || publishing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving || publishing}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || publishing}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
