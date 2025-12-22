// This provides a button to fetch all Pokemon from PokeAPI

'use client';

import { usePokemonFetch } from '@/hooks/usePokemonFetch';
import { usePokemonStore } from '@/store/pokemonStore';

export function FetchButton() {
  const { fetchPokemons, isLoading, progress, isSuccess } = usePokemonFetch();
  const pokemons = usePokemonStore((state) => state.pokemons);
  
  const handleClick = () => {
    if (window.confirm(
      'This will fetch all Pokemon from PokeAPI. It may take a few minutes. Continue?'
    )) {
      fetchPokemons();
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg 
                   hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        {isLoading ? 'Fetching...' : 'Fetch Full Pokedex Dataset'}
      </button>
      
      {isLoading && progress.total > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Fetching Pokemon...</span>
            <span className="font-semibold">
              {progress.current} / {progress.total}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            This may take 2-3 minutes depending on your connection
          </p>
        </div>
      )}
      
      {isSuccess && pokemons.length > 0 && (
        <p className="text-sm text-green-600 font-medium">
          ✓ Successfully loaded {pokemons.length} Pokemon!
        </p>
      )}
    </div>
  );
}