
// This component provide modal to add custom columns

'use client';

import { useState } from 'react';
import { usePokemonStore } from '@/store/pokemonStore';
import { ColumnDataType } from '@/types/pokemon';

interface AddColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddColumnModal({ isOpen, onClose }: AddColumnModalProps) {
  const { addCustomColumn } = usePokemonStore();
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState<ColumnDataType>('text');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!columnName.trim()) {
      alert('Please enter a column name');
      return;
    }
    
    const columnId = columnName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    
    let defaultValue: string | number | boolean = '';
    if (columnType === 'number') {
      defaultValue = 0;
    } else if (columnType === 'boolean') {
      defaultValue = false;
    }
    
    addCustomColumn({
      id: columnId,
      name: columnName,
      type: columnType,
      defaultValue,
    });
    
    setColumnName('');
    setColumnType('text');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-600">Add New Column</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Column Name */}
          <div>
            <label
              htmlFor="columnName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Column Name
            </label>
            <input
              id="columnName"
              type="text"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              placeholder="e.g., Generation, Legendary Status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-gray-500"
            />
          </div>
          
          {/* Column Type */}
          <div>
            <label
              htmlFor="columnType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Data Type
            </label>
            <select
              id="columnType"
              value={columnType}
              onChange={(e) => setColumnType(e.target.value as ColumnDataType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean (True/False)</option>
            </select>
          </div>
          
          {/* Info text */}
          <p className="text-xs text-gray-500">
            The new column will be added to all Pokemon with a default value:
            <br />
            • Text: empty string
            <br />
            • Number: 0
            <br />• Boolean: false
          </p>
          
          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold 
                       rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Column
            </button>
            <button
              type="button"
              onClick={() => {
                setColumnName('');
                setColumnType('text');
                onClose();
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-semibold 
                       rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddColumnButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg 
                 hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        + Add Column
      </button>
      
      <AddColumnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}