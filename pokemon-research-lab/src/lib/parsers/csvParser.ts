
// This module handles CSV file parsing using streaming
// we process data in chunks instead of loading everything at once

import Papa from 'papaparse';
import { Pokemon, CSVColumnMapping } from '@/types/pokemon';

export function parseCSVHeaders(
  file: File
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 1, 
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const headers = results.data[0] as string[];
          resolve(headers);
        } else {
          reject(new Error('No headers found in CSV'));
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

// Parse the entire CSV file with column mapping
export function parseCSVWithMapping(
  file: File,
  mappings: CSVColumnMapping[],
  onProgress?: (rowsProcessed: number) => void
): Promise<Pokemon[]> {
  return new Promise((resolve, reject) => {
    const results: Pokemon[] = [];
    let rowCount = 0;
    
    Papa.parse(file, {
      header: true, 
      dynamicTyping: true, 
      skipEmptyLines: true,
      chunk: (chunk, parser) => {
        // Process each chunk of data
        try {
          const chunkResults = chunk.data.map((row: any) => {
            return transformCSVRowToPokemon(row, mappings, rowCount++);
          });
          
          results.push(...chunkResults);
          
          if (onProgress) {
            onProgress(results.length);
          }
        } catch (error) {
          parser.abort();
          reject(error);
        }
      },
      complete: () => {
        resolve(results);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

// Transform a single CSV row into a Pokemon object based on mappings
function transformCSVRowToPokemon(
  row: any,
  mappings: CSVColumnMapping[],
  rowIndex: number
): Pokemon {

  const pokemon: Pokemon = {
    id: rowIndex + 1,
    name: 'Unknown',
    sprite: null,
    types: [],
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
    height: 0,
    weight: 0,
  };

  mappings.forEach((mapping) => {
    const value = row[mapping.csvHeader];
    
    if (value === undefined || value === null || value === '') {
      return; 
    }
    
    const convertedValue = convertValue(value, mapping.dataType);
    
    if (mapping.pokemonField === 'types' && typeof convertedValue === 'string') {
      pokemon.types = convertedValue
        .split(/[,\/]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    } else {
      (pokemon as any)[mapping.pokemonField] = convertedValue;
    }
  });
  
  return pokemon;
}

function convertValue(
  value: any,
  dataType: 'string' | 'number' | 'boolean'
): any {
  switch (dataType) {
    case 'number':
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    
    case 'boolean':
      if (typeof value === 'boolean') return value;
      const str = String(value).toLowerCase();
      return str === 'true' || str === '1' || str === 'yes';
    
    case 'string':
    default:
      return String(value);
  }
}

export function exportToCSV(
  pokemons: Pokemon[],
  customColumns: Array<{ id: string; name: string }>
): void {
  if (pokemons.length === 0) {
    alert('No data to export');
    return;
  }
  
  const baseColumns = [
    'id',
    'name',
    'types',
    'hp',
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed',
    'height',
    'weight',
  ];
  
  const allColumns = [
    ...baseColumns,
    ...customColumns.map((c) => c.id),
  ];
  
  const csvData = pokemons.map((pokemon) => {
    const row: any = {};
    
    allColumns.forEach((col) => {
      if (col === 'types') {
        row[col] = pokemon.types.join(', ');
      } else {
        row[col] = pokemon[col] !== undefined ? pokemon[col] : '';
      }
    });
    
    return row;
  });
  

  const csv = Papa.unparse(csvData, {
    columns: allColumns,
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `pokemon_data_${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}