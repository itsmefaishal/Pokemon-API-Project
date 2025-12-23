// the main container which contains all the table data 

'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Pokemon } from '@/types/pokemon';
import { usePokemonStore } from '@/store/pokemonStore';

const columnHelper = createColumnHelper<Pokemon>();

export function PokemonTable() {
  const { pokemons, customColumns, updatePokemon } = usePokemonStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingCell, setEditingCell] = useState<{
    rowId: number;
    columnId: string;
  } | null>(null);
  
  // table container
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // defining all the columns
  const baseColumns = useMemo(
    () => [

      columnHelper.accessor('id', {
        header: 'ID',
        size: 80,
        minSize: 80,
        maxSize: 80,
        cell: (info) => (
          <div className="text-center font-semibold text-gray-800">
            #{info.getValue()}
          </div>
        ),
      }),
      
      columnHelper.accessor('sprite', {
        header: 'Sprite',
        size: 100,
        minSize: 100,
        maxSize: 100,
        enableSorting: false,
        cell: (info) => {
          const sprite = info.getValue();
          const name = info.row.original.name;
          return (
            <div className="flex justify-center items-center">
              {sprite ? (
                <Image
                  src={sprite}
                  alt={name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
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
        minSize: 150,
        maxSize: 150,
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
        minSize: 150,
        maxSize: 150,
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
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <NumberCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="hp"
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
            onIncrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { hp: current + 1 });
            }}
            onDecrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { hp: Math.max(0, current - 1) });
            }}
          />
        ),
      }),
      
      columnHelper.accessor('attack', {
        header: 'Attack',
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <NumberCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="attack"
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
            onIncrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { attack: current + 1 });
            }}
            onDecrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { attack: Math.max(0, current - 1) });
            }}
          />
        ),
      }),
      
      columnHelper.accessor('defense', {
        header: 'Defense',
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <NumberCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="defense"
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
            onIncrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { defense: current + 1 });
            }}
            onDecrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { defense: Math.max(0, current - 1) });
            }}
          />
        ),
      }),
      
      columnHelper.accessor('specialAttack', {
        header: 'Sp. Atk',
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <NumberCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="specialAttack"
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
            onIncrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { specialAttack: current + 1 });
            }}
            onDecrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { specialAttack: Math.max(0, current - 1) });
            }}
          />
        ),
      }),
      
      columnHelper.accessor('specialDefense', {
        header: 'Sp. Def',
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <NumberCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="specialDefense"
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
            onIncrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { specialDefense: current + 1 });
            }}
            onDecrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { specialDefense: Math.max(0, current - 1) });
            }}
          />
        ),
      }),
      
      columnHelper.accessor('speed', {
        header: 'Speed',
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <NumberCell
            value={info.getValue()}
            rowId={info.row.original.id}
            columnId="speed"
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
            onIncrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { speed: current + 1 });
            }}
            onDecrement={() => {
              const current = info.getValue();
              updatePokemon(info.row.original.id, { speed: Math.max(0, current - 1) });
            }}
          />
        ),
      }),
    ],
    [editingCell, updatePokemon]
  );
  
  // functionality to add cuntom column 
  const allColumns = useMemo(() => {
    const dynamicColumns = customColumns.map((col) =>
      columnHelper.accessor(
        (row) => (row as Record<string, unknown>)[col.id],
        {
        header: col.name,
        size: 120,
        minSize: 120,
        maxSize: 120,
        cell: (info) => (
          <EditableCell
            value={String(info.getValue())}
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
  
  // Initialize TanStack Table with pagination
    const table = useReactTable<Pokemon & Record<string, unknown>>({
    data: pokemons,
    columns: allColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
    columnResizeMode: 'onChange',
  });
  
  const { rows } = table.getRowModel();
  
  // Initialize virtualizer for rows
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
      {/* Pagination buttons */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
          >
            ⏮️ First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
          >
            ⬅️ Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
          >
            Next ➡️
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
          >
            Last ⏭️
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium"
          >
            {[25, 50, 100, 200].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          
          <span className="text-sm text-gray-700">
            Total: <span className="font-semibold">{pokemons.length}</span> Pokemon
          </span>
        </div>
      </div>
      
      {/* Table container with virtualization */}
      <div
        ref={tableContainerRef}
        className="border border-gray-300 rounded-lg overflow-auto bg-white shadow-sm"
        style={{ height: '600px' }}
      >
        <table className="w-full table-fixed">
          <thead className="bg-gray-100 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
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
                      style={{ width: `${cell.column.getSize()}px` }}
                      className="px-4 py-2 text-sm text-gray-800 overflow-hidden text-ellipsis"
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

// Editable Cell Component
interface EditableCellProps {
  value: string | number | boolean | null;
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
  const [editValue, setEditValue] = useState(String(value ?? ''));
  
  useEffect(() => {
    setEditValue(String(value ?? ''));
  }, [value, isEditing]);
  
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
      className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded min-h-[2rem] flex items-center text-gray-800 font-medium truncate"
    >
      {String(value ?? '')}
    </div>
  );
}

interface NumberCellProps {
  value: number;
  rowId: number;
  columnId: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function NumberCell({
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onIncrement,
  onDecrement,
}: NumberCellProps) {
  const [editValue, setEditValue] = useState(String(value ?? 0));
  
  // Updating the value wrt to any change in the table row data
  useEffect(() => {
    setEditValue(String(value ?? 0));
  }, [value, isEditing]);
  
  if (isEditing) {
    return (
      <input
        type="number"
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
    // button to trigger the increment or decrement of the data in the rows
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        className="w-6 h-6 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-sm"
      >
        −
      </button>
      
      <div
        onClick={onEdit}
        className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded flex-1 text-center text-gray-800 font-semibold"
      >
        {value ?? 0}
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        className="w-6 h-6 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 rounded font-bold text-sm"
      >
        +
      </button>
    </div>
  );
}