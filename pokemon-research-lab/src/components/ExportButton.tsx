// This component exports the current Pokemon data to a CSV file

'use client';

import { usePokemonStore } from '@/store/pokemonStore';
import { exportToCSV } from '@/lib/parsers/csvParser';

export function ExportButton() {
  const { pokemons, customColumns } = usePokemonStore();
  
  const handleExport = () => {
    if (pokemons.length === 0) {
      alert('No data to export. Please load Pokemon data first.');
      return;
    }
    
    try {
      exportToCSV(pokemons, customColumns);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={pokemons.length === 0}
      className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg 
               hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed
               transition-colors duration-200 shadow-md hover:shadow-lg"
    >
      Export to CSV
    </button>
  );
}