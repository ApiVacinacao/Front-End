'use client';
import React from 'react';
import styles from './TableList.module.css';

interface Column<T> {
  title: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  className?: string;
}

interface TableListProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
}

export function TableList<T>({ data, columns, actions, loading }: TableListProps<T>) {
  if (loading) return <p>Carregando...</p>;

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.title}</th>
          ))}
          {actions && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            {columns.map((col, cidx) => (
              <td key={cidx}>{col.render ? col.render(item) : (item as any)[col.key]}</td>
            ))}
            {actions && (
              <td>
                {actions.map((action, aidx) => (
                  <button
                    key={aidx}
                    className={action.className}
                    onClick={() => action.onClick(item)}
                  >
                    {typeof action.label === 'function' ? action.label(item) : action.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
