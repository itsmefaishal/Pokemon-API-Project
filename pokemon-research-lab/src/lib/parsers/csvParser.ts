// This module handles CSV file parsing using streaming

import Papa from 'papaparse';
import { Pokemon, CSVColumnMapping } from '@/types/pokemon';

// parsing the headers of the csv 
export function parseCSVHeaders(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      preview: 1,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          resolve(results.data[0] as string[]);
        } else {
          reject(new Error('No headers found in CSV'));
        }
      },
      error: (error) => reject(error),
    });
  });
}

// function to parse the csv
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
        try {
          const chunkResults = (chunk.data as Record<string, unknown>[]).map(
            (row) => transformCSVRowToPokemon(row, mappings, rowCount++)
          );

          results.push(...chunkResults);
          onProgress?.(results.length);
        } catch (error) {
          parser.abort();
          reject(error);
        }
      },
      complete: () => resolve(results),
      error: (error) => reject(error),
    });
  });
}

// function to transform every csv row to pokemon type
function transformCSVRowToPokemon(
  row: Record<string, unknown>,
  mappings: CSVColumnMapping[],
  rowIndex: number
): Pokemon {
  const pokemon: Pokemon & Record<string, unknown> = {
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
    const rawValue = row[mapping.csvHeader];

    if (rawValue === undefined || rawValue === null || rawValue === '') return;

    const convertedValue = convertValue(rawValue, mapping.dataType);

    if (
      mapping.pokemonField === 'types' &&
      typeof convertedValue === 'string'
    ) {
      pokemon.types = convertedValue
        .split(/[,\/]/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    } else {
      pokemon[mapping.pokemonField] = convertedValue;
    }
  });

  return pokemon;
}


// function to convert the csv values
function convertValue(
  value: unknown,
  dataType: 'string' | 'number' | 'boolean'
): string | number | boolean {
  switch (dataType) {
    case 'number': {
      const num = Number(value);
      return Number.isNaN(num) ? 0 : num;
    }

    case 'boolean': {
      if (typeof value === 'boolean') return value;
      const str = String(value).toLowerCase();
      return str === 'true' || str === '1' || str === 'yes';
    }

    case 'string':
    default:
      return String(value);
  }
}

// method for export the data to csv
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
    'sprite',
    'types',
    'hp',
    'attack',
    'defense',
    'specialAttack',
    'specialDefense',
    'speed',
    'height',
    'weight',
  ] as const;

  const allColumns = [...baseColumns, ...customColumns.map((c) => c.id)];

  const csvData: Record<string, string | number>[] = pokemons.map((pokemon) => {
    const row: Record<string, string | number> = {};

    allColumns.forEach((col) => {
      if (col === 'types') {
        row[col] = pokemon.types.join(', ');
      } else {
        const value = (pokemon as Record<string, unknown>)[col];
        row[col] = value !== undefined ? String(value) : '';
      }
    });

    return row;
  });

  const csv = Papa.unparse(csvData, { columns: allColumns });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `pokemon_data_${Date.now()}.csv`;
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
