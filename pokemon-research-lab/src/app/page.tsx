// the main page that brings all components together
//  entry point of our application

'use client';

import { FetchButton } from '@/components/FetchButton';
import { CSVUpload } from '@/components/CSVUpload';
import { PokemonTable } from '@/components/PokemonTable';
import { AddColumnButton } from '@/components/AddColumnModal';
import { ExportButton } from '@/components/ExportButton';
import { usePokemonStore } from '@/store/pokemonStore';

export default function Home() {
  const { pokemons, customColumns, clearPokemons } = usePokemonStore();
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-5xl">🔬</span>
            The Pokemon Research Lab
          </h1>
          <p className="mt-2 text-gray-600">
            Aggregate, analyze, and manipulate Pokemon data with high-performance tools
          </p>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Data Sources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Fetch */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Option 1: Fetch from PokeAPI
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Load all Pokemon data from the official Pokemon API
              </p>
              <FetchButton />
            </div>
            
            {/* CSV Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Option 2: Upload CSV File
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Import your own Pokemon data from a CSV file
              </p>
              <CSVUpload />
            </div>
          </div>
        </div>
        
        {/* Table Controls */}
        {pokemons.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Table Controls</h2>
            
            <div className="flex flex-wrap gap-3">
              <AddColumnButton />
              <ExportButton />
              
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to clear all data? This cannot be undone.'
                    )
                  ) {
                    clearPokemons();
                  }
                }}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg 
                         hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Clear All Data
              </button>
            </div>
            
            {/* Custom Columns Display */}
            {customColumns.length > 0 && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-sm font-semibold text-purple-900 mb-2">
                  Custom Columns ({customColumns.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {customColumns.map((col) => (
                    <span
                      key={col.id}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {col.name} ({col.type})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pokemon Data</h2>
          <PokemonTable />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <p>Built with Next.js, TypeScript, TanStack Table, and Zustand</p>
        <p className="mt-1">Data from PokeAPI.co</p>
      </footer>
    </main>
  );
}