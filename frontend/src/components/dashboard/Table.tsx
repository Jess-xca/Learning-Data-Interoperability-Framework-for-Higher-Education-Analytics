import React from "react";
import { ChevronDown } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Table<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  striped = true,
  hoverable = true,
  className = "",
}: TableProps<T>) {
  const getRowKey = (row: T, index: number) => {
    if (keyExtractor) return keyExtractor(row, index);
    const id = row["id"] || row["key"];
    return id || index;
  };

  return (
    <div className={`overflow-x-auto rounded-lg border border-outline-variant/20 ${className}`}>
      <table className="w-full text-sm">
        <thead className="bg-primary-container text-on-primary-container border-b border-outline-variant/20">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left font-bold uppercase tracking-wider text-xs ${col.width ? `w-${col.width}` : ""}`}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-on-surface-variant"
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-outline-variant/20 ${
                  striped && index % 2 === 0
                    ? "bg-surface-container-low/50"
                    : ""
                } ${hoverable ? "hover:bg-surface-container-low transition-colors" : ""} ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-on-surface"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
