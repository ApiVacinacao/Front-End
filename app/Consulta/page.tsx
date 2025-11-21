'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './tipoConsulta.module.css';

interface TipoConsulta {
  id: number;
  descricao: string;
  status: boolean;
}

const API_URL = 'http://localhost:8000/api/tipoConsultas';

export default function TipoConsultaPage() {
  const [tipos, setTipos] = useState<TipoConsulta[]>([]);
  const [tipoEditando, setTipoEditando] = useState<TipoConsulta | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Erro: ' + res.status);
      const data = await res.json();
      setTipos(data);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar tipos de consulta');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}/toggle-status`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Erro ao alterar status');
      const atualizado = await res.json();
      setTipos(prev => prev.map(t => (t.id === atualizado.id ? atualizado : t)));
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status');
    }
  };

  const salvarEdicao = async (tipo: TipoConsulta) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${tipo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(tipo),
      });
      if (!res.ok) throw new Error('Erro ao salvar tipo');
      const atualizado = await res.json();
      setTipos(prev => prev.map(t => (t.id === atualizado.id ? atualizado : t)));
      setTipoEditando(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tipo de consulta');
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>🩺 Tipos de Consulta</h2>
        </div>

        {loading && <p className={styles.loading}>Carregando tipos...</p>}
        {erro && <p className={styles.error}>{erro}</p>}

        <div className={styles.tableWrapper}>
          {tipos.map(tipo => (
            <div key={tipo.id} className={styles.card}>
              <div>
                <p className={styles.cardTitle}>{tipo.descricao}</p>
                <p className={styles.statusText}>
                  Status:{' '}
                  <span
                    className={
                      tipo.status ? styles.statusAtivo : styles.statusInativo
                    }
                  >
                    {tipo.status ? 'Ativo' : 'Inativo'}
                  </span>
                </p>
              </div>
              <div className={styles.actions}>
                <button
                  className={`${styles.actionButton} ${styles.primary}`}
                  onClick={() => setTipoEditando(tipo)}
                >
                  Editar
                </button>
                <button
                  className={`${styles.actionButton} ${styles.secondary}`}
                  onClick={() => toggleStatus(tipo.id)}
                >
                  {tipo.status ? 'Inativar' : 'Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {tipoEditando && (
          <ModalEditarTipo
            tipo={tipoEditando}
            onClose={() => setTipoEditando(null)}
            onSave={salvarEdicao}
          />
        )}
      </main>
    </div>
  );
}

interface ModalProps {
  tipo: TipoConsulta;
  onClose: () => void;
  onSave: (tipo: TipoConsulta) => void;
}

function ModalEditarTipo({ tipo, onClose, onSave }: ModalProps) {
  const [descricao, setDescricao] = useState(tipo.descricao);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={styles.modalTitle}>Editar Tipo de Consulta</h3>
        <input
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          className={styles.modalInput}
        />
        <div className={styles.modalButtons}>
          <button className={`${styles.actionButton} ${styles.secondary}`} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`${styles.actionButton} ${styles.primary}`}
            onClick={() => onSave({ ...tipo, descricao })}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
