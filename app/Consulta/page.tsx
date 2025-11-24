'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './tipoConsulta.module.css';
import Swal from 'sweetalert2';
import ProtectedRoute from '../components/auth/protecetroute';

interface TipoConsulta {
  id: number;
  descricao: string;
  status: boolean;
}

const API_URL = 'http://localhost:8001/api/tipoConsultas';

export default function TipoConsultaPage() {
  const [tipos, setTipos] = useState<TipoConsulta[]>([]);
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
      setErro('Erro ao carregar tipos de consulta');
    } finally {
      setLoading(false);
    }
  };

  // 🔵 CONFIRMAÇÃO ANTES DE ATIVAR/INATIVAR
  const toggleStatus = async (id: number, statusAtual: boolean) => {
    const confirmar = await Swal.fire({
      title: statusAtual ? 'Confirmar Inativação?' : 'Confirmar Ativação?',
      text: `Você realmente deseja ${statusAtual ? 'inativar' : 'ativar'} este tipo de consulta?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (!confirmar.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}/toggle-status`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error('Erro ao alterar status');

      const atualizado = await res.json();
      setTipos(prev => prev.map(t => (t.id === atualizado.id ? atualizado : t)));

      Swal.fire({
        icon: 'success',
        title: `Status atualizado para ${atualizado.status ? 'Ativo' : 'Inativo'}!`,
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      Swal.fire('Erro', 'Não foi possível alterar o status.', 'error');
    }
  };

  // 🔵 EDIÇÃO COM CONFIRMAÇÃO
  const editarTipo = async (tipo: TipoConsulta) => {
    const { value: descricao } = await Swal.fire({
      title: 'Editar tipo de consulta',
      input: 'text',
      inputValue: tipo.descricao,
      confirmButtonText: 'Salvar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      inputValidator: value => {
        if (!value) return 'Digite uma descrição válida';
      }
    });

    if (!descricao) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${tipo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ descricao }),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      const atualizado = await res.json();

      setTipos(prev => prev.map(t => (t.id === atualizado.id ? atualizado : t)));

      Swal.fire({
        icon: 'success',
        title: 'Atualizado com sucesso!',
        timer: 1400,
        showConfirmButton: false,
      });

    } catch (err) {
      Swal.fire('Erro', 'Não foi possível salvar.', 'error');
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
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
                    onClick={() => editarTipo(tipo)}
                  >
                    Editar
                  </button>

                  <button
                    className={`${styles.actionButton} ${styles.secondary}`}
                    onClick={() => toggleStatus(tipo.id, tipo.status)}
                  >
                    {tipo.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
