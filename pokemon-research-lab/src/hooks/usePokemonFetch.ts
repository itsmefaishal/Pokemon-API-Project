// This hook manages the Pokemon fetching process
// It uses TanStack Query for caching, loading states, and error handling

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { fetchAllPokemon } from '@/lib/api/pokeapi';
import { usePokemonStore } from '@/store/pokemonStore';

export function usePokemonFetch() {
  const { setPokemons, setLoading, setError } = usePokemonStore();
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const mutation = useMutation({
    mutationFn: async () => {
      setProgress({ current: 0, total: 0 });
      
      const pokemons = await fetchAllPokemon((current, total) => {
        setProgress({ current, total });
      });
      
      return pokemons;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      setPokemons(data);
      setLoading(false);
      setProgress({ current: data.length, total: data.length });
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to fetch Pokemon data');
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    },
  });
  
  return {
    fetchPokemons: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    progress,
    isSuccess: mutation.isSuccess,
  };
}