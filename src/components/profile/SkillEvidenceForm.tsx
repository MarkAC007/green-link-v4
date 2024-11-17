import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface SkillEvidenceFormProps {
  skillId: string;
  onSubmit: (files: File[], descriptions: string[]) => void;
  onCancel: () => void;
}

export function SkillEvidenceForm({ skillId, onSubmit, onCancel }: SkillEvidenceFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      await onSubmit(files, descriptions);
    } catch (error) {
      console.error('Error submitting evidence:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Evidence
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                <span>Upload files</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, JPG, JPEG, PNG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
          <ul className="mt-2 divide-y divide-gray-200">
            {files.map((file, index) => (
              <li key={index} className="py-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={descriptions[0] || ''}
          onChange={(e) => setDescriptions([e.target.value])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          rows={3}
          placeholder="Describe your experience with this skill..."
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || files.length === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? 'Adding...' : 'Add Evidence'}
        </button>
      </div>
    </div>
  );
}
