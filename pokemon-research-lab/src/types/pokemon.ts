// This file defines the shape of our Pokemon basically Pokeman class/Interface

export interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonSprite {
  front_default: string | null;
}

// main Pokemon data structure
export interface Pokemon {
  id: number;
  name: string;
  sprite: string | null;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  height: number;
  weight: number;
  [key: string]: unknown;
}

export interface PokeAPIResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: PokemonSprite;
  types: PokemonType[];
  stats: PokemonStat[];
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface CustomColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean';
  defaultValue: string | number | boolean;
}

export type ColumnDataType = 'text' | 'number' | 'boolean';

export interface CSVColumnMapping {
  csvHeader: string; 
  pokemonField: keyof Pokemon | string; 
  dataType: 'string' | 'number' | 'boolean';
}