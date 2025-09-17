'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './tipoConsulta.module.css';

type TipoConsulta = {
  id: number;
  descricao: string;
  status: boolean;
};

const API_URL = 'http://localhost:8001/api/tipoConsultas';

export default function TipoConsultaPage() {
  const [tipos, setTipos] = useState<TipoConsulta[]>([]);
  const [selected, setSelected] = useState<TipoConsulta | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Buscar do backend
  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Erro ao buscar tipos de consulta');
      const data = await res.json();
      setTipos(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar tipos de consulta');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo?: TipoConsulta) => {
    setSelected(tipo || { id: 0, descricao: '', status: true });
    setOpenModal(true);
  };

  const salvarTipo = async (tipo: TipoConsulta) => {
    if (!tipo.descricao.trim()) {
      alert('Preencha a descrição.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      let res: Response;

      if (tipo.id === 0) {
        // Criar novo sempre como ativo
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ descricao: tipo.descricao, status: true }),
        });
      } else {
        // Atualizar existente mantendo o status
        res = await fetch(`${API_URL}/${tipo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ descricao: tipo.descricao, status: tipo.status }),
        });
      }

      if (!res.ok) throw new Error('Erro ao salvar tipo de consulta');

      await res.json();
      fetchTipos(); // atualizar lista
      setOpenModal(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar tipo de consulta');
    }
  };

  const toggleStatus = async (tipo: TipoConsulta) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${tipo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: !tipo.status }),
      });

      if (!res.ok) throw new Error('Erro ao alterar status');

      fetchTipos(); // atualizar lista
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status');
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Tipos de Consulta</h2>
        </div>

        {loading ? <p>Carregando...</p> : (
          <div>
            {tipos.map(tipo => (
              <div key={tipo.id} className={styles.card}>
                <div>
                  <strong>{tipo.descricao}</strong>
                  <p>Status: <span className={tipo.status ? styles.ativo : styles.inativo}>
                    {tipo.status ? 'Ativo' : 'Inativo'}
                  </span></p>
                </div>
                <div className={styles.botoes}>
                  <button className={styles.btnDetails} onClick={() => abrirModal(tipo)}>Editar</button>
                  <button className={styles.btnToggle} onClick={() => toggleStatus(tipo)}>
                    {tipo.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button className={styles.floatingBtn} onClick={() => abrirModal()}>➕ Novo</button>

        {openModal && selected && (
          <ModalTipoConsulta
            tipo={selected}
            onSalvar={salvarTipo}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </>
  );
}

function ModalTipoConsulta({ tipo, onSalvar, onCancelar }: {
  tipo: TipoConsulta;
  onSalvar: (tipo: TipoConsulta) => void;
  onCancelar: () => void;
}) {
  const [descricao, setDescricao] = useState(tipo.descricao);

  const salvar = () => onSalvar({ ...tipo, descricao });

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{tipo.id === 0 ? 'Novo Tipo de Consulta' : 'Editar Tipo de Consulta'}</h2>

        <label className={styles.modalLabel}>Descrição</label>
        <input
          className={styles.modalInput}
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          autoFocus
        />

        <div className={styles.modalButtons}>
          <button className={styles.buttonClose} onClick={onCancelar}>Cancelar</button>
          <button className={styles.buttonSubmit} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
