// This handles CSV file upload and column mapping

'use client';

import { useState } from 'react';
import { parseCSVHeaders, parseCSVWithMapping } from '@/lib/parsers/csvParser';
import { CSVColumnMapping } from '@/types/pokemon';
import { usePokemonStore } from '@/store/pokemonStore';

const POKEMON_FIELDS = [
  { value: 'id', label: 'ID', type: 'number' },
  { value: 'name', label: 'Name', type: 'string' },
  { value: 'types', label: 'Type(s)', type: 'string' },
  { value: 'hp', label: 'HP', type: 'number' },
  { value: 'attack', label: 'Attack', type: 'number' },
  { value: 'defense', label: 'Defense', type: 'number' },
  { value: 'specialAttack', label: 'Special Attack', type: 'number' },
  { value: 'specialDefense', label: 'Special Defense', type: 'number' },
  { value: 'speed', label: 'Speed', type: 'number' },
  { value: 'height', label: 'Height', type: 'number' },
  { value: 'weight', label: 'Weight', type: 'number' },
] as const;

export function CSVUpload() {
  const { setPokemons, setLoading } = usePokemonStore();
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<CSVColumnMapping[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }
    
    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      const csvHeaders = await parseCSVHeaders(selectedFile);
      setHeaders(csvHeaders);
      
      const initialMappings: CSVColumnMapping[] = csvHeaders.map((header) => ({
        csvHeader: header,
        pokemonField: '',
        dataType: 'string',
      }));
      
      setMappings(initialMappings);
      setShowMapping(true);
    } catch (error) {
      console.error('Error reading CSV headers:', error);
      alert('Error reading CSV file. Please check the file format.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const updateMapping = (index: number, field: string, value: string) => {
    const newMappings = [...mappings];
    
    if (field === 'pokemonField') {
      newMappings[index].pokemonField = value;
      
      const fieldInfo = POKEMON_FIELDS.find((f) => f.value === value);
      if (fieldInfo) {
        newMappings[index].dataType = fieldInfo.type as any;
      }
    } else if (field === 'dataType') {
      newMappings[index].dataType = value as any;
    }
    
    setMappings(newMappings);
  };
  
  const handleProcessCSV = async () => {
    if (!file) return;
    
    const validMappings = mappings.filter((m) => m.pokemonField !== '');
    
    if (validMappings.length === 0) {
      alert('Please map at least one column');
      return;
    }
    
    setIsProcessing(true);
    setLoading(true);
    setUploadProgress(0);
    
    try {
      const pokemons = await parseCSVWithMapping(
        file,
        validMappings,
        (rowsProcessed) => {
          setUploadProgress(rowsProcessed);
        }
      );
      
      setPokemons(pokemons);
      alert(`Successfully loaded ${pokemons.length} Pokemon from CSV!`);
      
      setFile(null);
      setHeaders([]);
      setMappings([]);
      setShowMapping(false);
      setUploadProgress(0);
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file. Please check your mappings.');
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* File upload button */}
      <div>
        <label
          htmlFor="csv-upload"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg 
                     hover:bg-green-700 cursor-pointer inline-block transition-colors 
                     duration-200 shadow-md hover:shadow-lg"
        >
          Upload CSV File
        </label>
        <input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-medium">{file.name}</span>
          </p>
        )}
      </div>
      
      {/* Column mapping interface */}
      {showMapping && (
        <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-600">Map CSV Columns to Pokemon Fields</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select which Pokemon field each CSV column should map to. Unmapped columns will be ignored.
          </p>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mappings.map((mapping, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded border border-gray-200"
              >
                {/* CSV Header */}
                <div className="flex-1 min-w-0">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    CSV Column
                  </label>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {mapping.csvHeader}
                  </div>
                </div>
                
                <div className="text-gray-400">→</div>
                
                {/* Pokemon Field */}
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Pokemon Field
                  </label>
                  <select
                    value={mapping.pokemonField}
                    onChange={(e) => updateMapping(index, 'pokemonField', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Skip this column --</option>
                    {POKEMON_FIELDS.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleProcessCSV}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg 
                       hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-colors duration-200"
            >
              {isProcessing ? 'Processing...' : 'Import Data'}
            </button>
            
            <button
              onClick={() => {
                setFile(null);
                setHeaders([]);
                setMappings([]);
                setShowMapping(false);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg 
                       hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
          
          {/* Progress indicator */}
          {isProcessing && uploadProgress > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Processed {uploadProgress} rows...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}