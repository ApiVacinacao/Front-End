'use client';
import React from 'react';
import { FiEdit2, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import styles from './TableList.module.css';

interface Column<T> {
  title: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  type?: 'primary' | 'secondary' | 'danger';
  icon?: React.ReactNode;
}

interface TableListProps<T> {
  data?: T[];
  columns?: Column<T>[];
  actions?: Action<T>[];
  loading?: boolean;
  title?: string;
}

export function TableList<T>({
  data = [],
  columns = [],
  actions = [],
  loading = false,
  title = 'Listagem',
}: TableListProps<T>) {
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.titleBar}>
        <h2>{title}</h2>
      </div>

      {data.length === 0 ? (
        <p className={styles.empty}>Nenhum dado encontrado.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx}>{col.title}</th>
                ))}
                {actions.length > 0 && <th className={styles.actionsCol}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  {columns.map((col, cidx) => (
                    <td key={cidx}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className={styles.actions}>
                      {actions.map((action, aidx) => {
                        const icon =
                          action.icon ||
                          (typeof action.label === 'string'
                            ? action.label === 'Editar'
                              ? <FiEdit2 />
                              : action.label === 'Excluir'
                              ? <FiTrash2 />
                              : action.label === 'Ativar'
                              ? <FiCheckCircle />
                              : action.label === 'Inativar'
                              ? <FiXCircle />
                              : null
                            : null);

                        return (
                          <button
                            key={aidx}
                            className={`${styles.actionButton} ${styles[action.type || 'secondary']}`}
                            onClick={() => action.onClick(item)}
                          >
                            {icon && <span className={styles.icon}>{icon}</span>}
                            {typeof action.label === 'function'
                              ? action.label(item)
                              : action.label}
                          </button>
                        );
                      })}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
