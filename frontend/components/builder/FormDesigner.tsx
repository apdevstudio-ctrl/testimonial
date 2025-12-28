'use client';

import { useState } from 'react';
import { GripVertical, Eye, EyeOff, Trash2, Plus, MoveUp, MoveDown } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'select' | 'checkbox';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  visible: boolean;
  order: number;
  options?: string[]; // For select fields
  min?: number;
  max?: number;
}

interface FormDesign {
  fields: FormField[];
  layout: 'single' | 'two-column' | 'three-column';
  showHeader: boolean;
  headerText: string;
  headerSubtext?: string;
  showFooter: boolean;
  footerText?: string;
  submitButtonText: string;
  submitButtonPosition: 'left' | 'center' | 'right' | 'full';
}

interface FormDesignerProps {
  formDesign: FormDesign;
  theme: any;
  onUpdate: (formDesign: FormDesign) => void;
}

const defaultFields: FormField[] = [
  { id: '1', type: 'text', label: 'Name', name: 'author[name]', placeholder: 'Enter your name', required: true, visible: true, order: 1 },
  { id: '2', type: 'email', label: 'Email', name: 'author[email]', placeholder: 'Enter your email', required: true, visible: true, order: 2 },
  { id: '3', type: 'textarea', label: 'Testimonial', name: 'text', placeholder: 'Share your experience...', required: true, visible: true, order: 3 },
  { id: '4', type: 'number', label: 'Rating', name: 'rating', placeholder: '1-5', required: false, visible: true, order: 4, min: 1, max: 5 },
];

export default function FormDesigner({ formDesign, theme, onUpdate }: FormDesignerProps) {
  const [fields, setFields] = useState<FormField[]>(formDesign.fields.length > 0 ? formDesign.fields : defaultFields);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  const updateFormDesign = (updates: Partial<FormDesign>) => {
    onUpdate({ ...formDesign, ...updates });
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Field',
      name: 'field_' + Date.now(),
      placeholder: 'Enter value',
      required: false,
      visible: true,
      order: fields.length + 1,
    };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    updateFormDesign({ fields: updatedFields });
    setSelectedField(newField);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    const updatedFields = fields.map(f => f.id === fieldId ? { ...f, ...updates } : f);
    setFields(updatedFields);
    updateFormDesign({ fields: updatedFields });
    if (selectedField?.id === fieldId) {
      setSelectedField({ ...selectedField, ...updates });
    }
  };

  const deleteField = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId);
    setFields(updatedFields);
    updateFormDesign({ fields: updatedFields });
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const toggleFieldVisibility = (fieldId: string) => {
    updateField(fieldId, { visible: !fields.find(f => f.id === fieldId)?.visible });
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const fieldIndex = fields.findIndex(f => f.id === fieldId);
    if (fieldIndex === -1) return;

    const newIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
    if (newIndex < 0 || newIndex >= fields.length) return;

    const updatedFields = [...fields];
    [updatedFields[fieldIndex], updatedFields[newIndex]] = [updatedFields[newIndex], updatedFields[fieldIndex]];
    updatedFields.forEach((f, i) => { f.order = i + 1; });
    
    setFields(updatedFields);
    updateFormDesign({ fields: updatedFields });
  };

  const renderFieldPreview = (field: FormField) => {
    const baseStyles = {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: theme.borderRadius || '8px',
      fontFamily: theme.fontFamily || 'inherit',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={4}
            style={baseStyles}
            disabled
          />
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            style={baseStyles}
            disabled
          />
        );
      case 'email':
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            style={baseStyles}
            disabled
          />
        );
      case 'select':
        return (
          <select style={baseStyles} disabled>
            <option>{field.placeholder || 'Select an option'}</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            style={baseStyles}
            disabled
          />
        );
    }
  };

  const visibleFields = fields.filter(f => f.visible).sort((a, b) => a.order - b.order);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Fields Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Form Fields</h3>
            <Button size="sm" onClick={addField}>
              <Plus className="h-4 w-4 mr-1" />
              Add Field
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {fields.sort((a, b) => a.order - b.order).map((field) => (
              <div
                key={field.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedField?.id === field.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedField(field)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-sm text-gray-900">{field.label}</span>
                    {field.required && (
                      <span className="text-xs text-red-500">*</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFieldVisibility(field.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {field.visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteField(field.id);
                      }}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveField(field.id, 'up');
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={field.order === 1}
                  >
                    <MoveUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveField(field.id, 'down');
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                    disabled={field.order === fields.length}
                  >
                    <MoveDown className="h-3 w-3" />
                  </button>
                  <span className="ml-2">{field.type}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Field Editor */}
        {selectedField && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Field</h3>
            <div className="space-y-4">
              <Input
                label="Label"
                value={selectedField.label}
                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
              />
              <Input
                label="Name (field name)"
                value={selectedField.name}
                onChange={(e) => updateField(selectedField.id, { name: e.target.value })}
                helperText="Used for form submission"
              />
              <Input
                label="Placeholder"
                value={selectedField.placeholder || ''}
                onChange={(e) => updateField(selectedField.id, { placeholder: e.target.value })}
              />
              <Select
                label="Field Type"
                value={selectedField.type}
                onChange={(e) => updateField(selectedField.id, { type: e.target.value as any })}
                options={[
                  { value: 'text', label: 'Text' },
                  { value: 'email', label: 'Email' },
                  { value: 'textarea', label: 'Textarea' },
                  { value: 'number', label: 'Number' },
                  { value: 'select', label: 'Select' },
                ]}
              />
              {selectedField.type === 'number' && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min"
                    type="number"
                    value={selectedField.min?.toString() || ''}
                    onChange={(e) => updateField(selectedField.id, { min: parseInt(e.target.value) || undefined })}
                  />
                  <Input
                    label="Max"
                    type="number"
                    value={selectedField.max?.toString() || ''}
                    onChange={(e) => updateField(selectedField.id, { max: parseInt(e.target.value) || undefined })}
                  />
                </div>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Required Field</span>
              </label>
            </div>
          </Card>
        )}

        {/* Form Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formDesign.showHeader}
                onChange={(e) => updateFormDesign({ showHeader: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Header</span>
            </label>
            {formDesign.showHeader && (
              <>
                <Input
                  label="Header Text"
                  value={formDesign.headerText}
                  onChange={(e) => updateFormDesign({ headerText: e.target.value })}
                />
                <Input
                  label="Header Subtext (optional)"
                  value={formDesign.headerSubtext || ''}
                  onChange={(e) => updateFormDesign({ headerSubtext: e.target.value })}
                />
              </>
            )}
            <Select
              label="Layout"
              value={formDesign.layout}
              onChange={(e) => updateFormDesign({ layout: e.target.value as any })}
              options={[
                { value: 'single', label: 'Single Column' },
                { value: 'two-column', label: 'Two Columns' },
                { value: 'three-column', label: 'Three Columns' },
              ]}
            />
            <Input
              label="Submit Button Text"
              value={formDesign.submitButtonText}
              onChange={(e) => updateFormDesign({ submitButtonText: e.target.value })}
            />
            <Select
              label="Submit Button Position"
              value={formDesign.submitButtonPosition}
              onChange={(e) => updateFormDesign({ submitButtonPosition: e.target.value as any })}
              options={[
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
                { value: 'full', label: 'Full Width' },
              ]}
            />
          </div>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Form Preview</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>

          {showPreview && (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg bg-white p-6"
              style={{ fontFamily: theme.fontFamily || 'inherit' }}
            >
              {formDesign.showHeader && (
                <div className="mb-6 text-center">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: theme.primaryColor || '#007bff' }}
                  >
                    {formDesign.headerText || 'Share Your Testimonial'}
                  </h2>
                  {formDesign.headerSubtext && (
                    <p className="text-gray-600">{formDesign.headerSubtext}</p>
                  )}
                </div>
              )}

              <form
                className={`space-y-4 ${
                  formDesign.layout === 'two-column' ? 'grid grid-cols-2 gap-4' :
                  formDesign.layout === 'three-column' ? 'grid grid-cols-3 gap-4' :
                  'flex flex-col'
                }`}
              >
                {visibleFields.map((field) => (
                  <div
                    key={field.id}
                    className={formDesign.layout === 'single' ? 'w-full' : ''}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFieldPreview(field)}
                  </div>
                ))}
              </form>

              <div
                className={`mt-6 ${
                  formDesign.submitButtonPosition === 'full' ? 'w-full' :
                  formDesign.submitButtonPosition === 'center' ? 'flex justify-center' :
                  formDesign.submitButtonPosition === 'right' ? 'flex justify-end' :
                  'flex justify-start'
                }`}
              >
                <button
                  type="button"
                  className="px-6 py-3 text-white font-medium rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: theme.primaryColor || '#007bff',
                    borderRadius: theme.borderRadius || '8px',
                    width: formDesign.submitButtonPosition === 'full' ? '100%' : 'auto',
                  }}
                >
                  {formDesign.submitButtonText || 'Submit Testimonial'}
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

