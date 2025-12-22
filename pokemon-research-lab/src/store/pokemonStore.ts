
// This is our global state manager using Zustand

import { create } from 'zustand';
import { Pokemon, CustomColumn } from '@/types/pokemon';

// the shape of our store
interface PokemonStore {

  pokemons: Pokemon[]; 
  customColumns: CustomColumn[];
  isLoading: boolean; 
  error: string | null; 
  
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
export const usePokemonStore = create<PokemonStore>((set, get) => ({
  // Initial state
  pokemons: [],
  customColumns: [],
  isLoading: false,
  error: null,
  
  setPokemons: (pokemons) => 
    set({ pokemons, error: null }),
  
  addPokemon: (pokemon) =>
    set((state) => ({
      pokemons: [...state.pokemons, pokemon],
    })),
  
  updatePokemon: (id, updates) =>
    set((state) => ({
      pokemons: state.pokemons.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  
  deletePokemon: (id) =>
    set((state) => ({
      pokemons: state.pokemons.filter((p) => p.id !== id),
    })),

  clearPokemons: () =>
    set({ pokemons: [], customColumns: [], error: null }),
  
  addCustomColumn: (column) =>
    set((state) => {

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
  
  removeCustomColumn: (columnId) =>
    set((state) => {
      const newColumns = state.customColumns.filter((c) => c.id !== columnId);
      
      const updatedPokemons = state.pokemons.map((pokemon) => {
        const { [columnId]: removed, ...rest } = pokemon;
        return rest as Pokemon;
      });
      
      return {
        customColumns: newColumns,
        pokemons: updatedPokemons,
      };
    }),
  
  bulkUpdatePokemons: (filter, updates) =>
    set((state) => ({
      pokemons: state.pokemons.map((pokemon) =>
        filter(pokemon) ? { ...pokemon, ...updates } : pokemon
      ),
    })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
}));