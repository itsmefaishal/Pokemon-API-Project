// This is the high-performance virtualized table

'use client';

import { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Pokemon } from '@/types/pokemon';
import { usePokemonStore } from '@/store/pokemonStore';
import { useRef } from 'react';

const columnHelper = createColumnHelper<Pokemon>();

export function PokemonTable() {
  const { pokemons, customColumns, updatePokemon } = usePokemonStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    columnId: string;
  } | null>(null);
  
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  const baseColumns = useMemo<ColumnDef<Pokemon, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        size: 80,
        cell: (info) => (
          <div className="text-center font-semibold text-gray-700">
            #{info.getValue()}
          </div>
        ),
      }),
      
      columnHelper.accessor('sprite', {
        header: 'Sprite',
        size: 100,
        enableSorting: false,
        cell: (info) => {
          const sprite = info.getValue();
          const name = info.row.original.name;
          return (
            <div className="flex justify-center items-center">
              {sprite ? (
                <img
                  src={sprite}
                  alt={name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>
          );
        },
      }),
      
      columnHelper.accessor('name', {
        header: 'Name',
        size: 150,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="name"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'name'
            }
            onEdit={() =>
              setEditingCell({ rowId: info.row.original.id, columnId: 'name' })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, { name: newValue });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
      
      columnHelper.accessor('types', {
        header: 'Type(s)',
        size: 150,
        cell: (info) => {
          const types = info.getValue();
          return (
            <div className="flex gap-1 flex-wrap">
              {types.map((type: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize"
                >
                  {type}
                </span>
              ))}
            </div>
          );
        },
      }),
      
      columnHelper.accessor('hp', {
        header: 'HP',
        size: 80,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="hp"
            type="number"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'hp'
            }
            onEdit={() =>
              setEditingCell({ rowId: info.row.original.id, columnId: 'hp' })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, { hp: Number(newValue) });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
      
      columnHelper.accessor('attack', {
        header: 'Attack',
        size: 80,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="attack"
            type="number"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'attack'
            }
            onEdit={() =>
              setEditingCell({ rowId: info.row.original.id, columnId: 'attack' })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, { attack: Number(newValue) });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
      
      columnHelper.accessor('defense', {
        header: 'Defense',
        size: 80,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="defense"
            type="number"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'defense'
            }
            onEdit={() =>
              setEditingCell({ rowId: info.row.original.id, columnId: 'defense' })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, { defense: Number(newValue) });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
      
      columnHelper.accessor('specialAttack', {
        header: 'Sp. Atk',
        size: 90,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="specialAttack"
            type="number"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'specialAttack'
            }
            onEdit={() =>
              setEditingCell({
                rowId: info.row.original.id,
                columnId: 'specialAttack',
              })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, {
                specialAttack: Number(newValue),
              });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
      
      columnHelper.accessor('specialDefense', {
        header: 'Sp. Def',
        size: 90,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="specialDefense"
            type="number"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'specialDefense'
            }
            onEdit={() =>
              setEditingCell({
                rowId: info.row.original.id,
                columnId: 'specialDefense',
              })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, {
                specialDefense: Number(newValue),
              });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
      
      columnHelper.accessor('speed', {
        header: 'Speed',
        size: 80,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="speed"
            type="number"
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === 'speed'
            }
            onEdit={() =>
              setEditingCell({ rowId: info.row.original.id, columnId: 'speed' })
            }
            onSave={(newValue) => {
              updatePokemon(info.row.original.id, { speed: Number(newValue) });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      }),
    ],
    [editingCell, updatePokemon]
  );
  
  const allColumns = useMemo(() => {
    const dynamicColumns = customColumns.map((col) =>
      columnHelper.accessor(col.id as any, {
        header: col.name,
        size: 120,
        cell: (info) => (
          <EditableCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId={col.id}
            type={col.type === 'number' ? 'number' : 'text'}
            isEditing={
              editingCell?.rowId === info.row.original.id &&
              editingCell?.columnId === col.id
            }
            onEdit={() =>
              setEditingCell({ rowId: info.row.original.id, columnId: col.id })
            }
            onSave={(newValue) => {
              const value =
                col.type === 'number'
                  ? Number(newValue)
                  : col.type === 'boolean'
                  ? newValue === 'true'
                  : newValue;
              updatePokemon(info.row.original.id, { [col.id]: value });
              setEditingCell(null);
            }}
            onCancel={() => setEditingCell(null)}
          />
        ),
      })
    );
    
    return [...baseColumns, ...dynamicColumns];
  }, [baseColumns, customColumns, editingCell, updatePokemon]);
  
  const table = useReactTable({
    data: pokemons,
    columns: allColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  
  const { rows } = table.getRowModel();
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 80, 
    overscan: 10, 
  });
  
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;
  
  if (pokemons.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg font-medium">No Pokemon data loaded</p>
        <p className="text-sm mt-2">
          Fetch data from the API or upload a CSV file to get started
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{pokemons.length}</span> Pokemon
        </p>
      </div>
      
      <div
        ref={tableContainerRef}
        className="border border-gray-300 rounded-lg overflow-auto bg-white shadow-sm"
        style={{ height: '600px' }}
      >
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-2 hover:text-gray-900'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="px-4 py-2 text-sm text-gray-900"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


interface EditableCellProps {
  value: any;
  rowId: number;
  columnId: string;
  type?: 'text' | 'number';
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
}

function EditableCell({
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  type = 'text',
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(String(value));
  
  if (isEditing) {
    return (
      <input
        type={type}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => onSave(editValue)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSave(editValue);
          } else if (e.key === 'Escape') {
            onCancel();
          }
        }}
        autoFocus
        className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
      />
    );
  }
  
  return (
    <div
      onClick={onEdit}
      className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded min-h-[2rem] flex items-center"
    >
      {String(value)}
    </div>
  );
}