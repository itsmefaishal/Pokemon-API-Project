
// This module handles all API calls to PokeAPI
// It transforms raw API data into Pokemon format

import {
  Pokemon,
  PokeAPIResponse,
  PokemonListResponse,
} from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export function transformPokemonData(data: PokeAPIResponse): Pokemon {
  // Find specific stats by name
  const findStat = (statName: string): number => {
    const stat = data.stats.find((s) => s.stat.name === statName);
    return stat?.base_stat || 0;
  };
  
  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    sprite: data.sprites.front_default,
    types: data.types.map((t) => t.type.name),
    hp: findStat('hp'),
    attack: findStat('attack'),
    defense: findStat('defense'),
    specialAttack: findStat('special-attack'),
    specialDefense: findStat('special-defense'),
    speed: findStat('speed'),
    height: data.height,
    weight: data.weight,
  };
}

export async function fetchPokemonList(): Promise<PokemonListResponse> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=10000`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PokemonListResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    throw error;
  }
}


export async function fetchPokemonDetails(
  nameOrId: string | number
): Promise<Pokemon> {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: PokeAPIResponse = await response.json();
    return transformPokemonData(data);
  } catch (error) {
    console.error(`Error fetching Pokemon ${nameOrId}:`, error);
    throw error;
  }
}

// Fetch multiple Pokemon in batches
export async function fetchPokemonBatch(
  pokemonList: Array<{ name: string; url: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<Pokemon[]> {
  const results: Pokemon[] = [];
  const total = pokemonList.length;
  
  // Process in batches of 50 to avoid overwhelming the API
  const BATCH_SIZE = 50;
  
  for (let i = 0; i < pokemonList.length; i += BATCH_SIZE) {
    const batch = pokemonList.slice(i, i + BATCH_SIZE);
    
    const batchPromises = batch.map((p) =>
      fetchPokemonDetails(p.name).catch((error) => {
        console.error(`Failed to fetch ${p.name}:`, error);
        return null; 
      })
    );
    
    const batchResults = await Promise.all(batchPromises);
    
    const validResults = batchResults.filter(
      (p): p is Pokemon => p !== null
    );
    
    results.push(...validResults);
    
    if (onProgress) {
      onProgress(results.length, total);
    }
  }
  
  return results;
}


export async function fetchAllPokemon(
  onProgress?: (current: number, total: number) => void
): Promise<Pokemon[]> {
  try {
    const listData = await fetchPokemonList();
    
    const allPokemon = await fetchPokemonBatch(
      listData.results,
      onProgress
    );
    
    return allPokemon.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error('Error in fetchAllPokemon:', error);
    throw error;
  }
}