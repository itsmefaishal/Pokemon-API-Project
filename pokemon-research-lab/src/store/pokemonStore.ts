
// global state manager using Zustand

import { create } from 'zustand';
import { Pokemon, CustomColumn } from '@/types/pokemon';

// structure of the pokemon store
interface PokemonStore {
  pokemons: Pokemon[];
  customColumns: CustomColumn[]; 
  isLoading: boolean; 
  error: string | null; 
  
  // crud funtions for pokemon state
  setPokemons: (pokemons: Pokemon[]) => void;
  addPokemon: (pokemon: Pokemon) => void;
  updatePokemon: (id: number, updates: Partial<Pokemon>) => void;
  deletePokemon: (id: number) => void;
  clearPokemons: () => void;
  
  addCustomColumn: (column: CustomColumn) => void;
  removeCustomColumn: (columnId: string) => void;
  
  bulkUpdatePokemons: (
    filter: (pokemon: Pokemon) => boolean,
    updates: Partial<Pokemon>
  ) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store

export const usePokemonStore = create<PokemonStore>((set) => ({
  // Initial state
  pokemons: [],
  customColumns: [],
  isLoading: false,
  error: null,
  
  // Set all pokemons
  setPokemons: (pokemons) => 
    set({ pokemons, error: null }),
  
  // Add a single pokemon
  addPokemon: (pokemon) =>
    set((state) => ({
      pokemons: [...state.pokemons, pokemon],
    })),
  
  // Update pokemon by ID
  updatePokemon: (id, updates) =>
    set((state) => ({
      pokemons: state.pokemons.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  
  // Delete pokemon by ID
  deletePokemon: (id) =>
    set((state) => ({
      pokemons: state.pokemons.filter((p) => p.id !== id),
    })),
  
  // Clear all pokemon data
  clearPokemons: () =>
    set({ pokemons: [], customColumns: [], error: null }),
  
  // Add a new custom column
  addCustomColumn: (column) =>
    set((state) => {
      // Add the new column to our columns list
      const newColumns = [...state.customColumns, column];
      
      const updatedPokemons = state.pokemons.map((pokemon) => ({
        ...pokemon,
        [column.id]: column.defaultValue,
      }));
      
      return {
        customColumns: newColumns,
        pokemons: updatedPokemons,
      };
    }),
  
  // Remove a custom column
  removeCustomColumn: (columnId) =>
    set((state) => {
      const newColumns = state.customColumns.filter((c) => c.id !== columnId);
      
      const updatedPokemons = state.pokemons.map((pokemon) => 
        Object.fromEntries(
          Object.entries(pokemon).filter(([key]) => key !== columnId)
        ) as Pokemon
      );
      
      return {
        customColumns: newColumns,
        pokemons: updatedPokemons,
      };
    }),
  
  // Bulk update multiple pokemon
  bulkUpdatePokemons: (filter, updates) =>
    set((state) => ({
      pokemons: state.pokemons.map((pokemon) =>
        filter(pokemon) ? { ...pokemon, ...updates } : pokemon
      ),
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));