'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css'; // reaproveitando CSS dos médicos

interface Local {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  status: boolean;
}

const API_URL = 'http://localhost:8000/api/localAtendimentos';

export default function LocaisPage() {
  const [locais, setLocais] = useState<Local[]>([]);
  const [selected, setSelected] = useState<Local | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token) headers.append("Authorization", `Bearer ${token}`);
    return headers;
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  const fetchLocais = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erro ao buscar locais');
      setLocais(await res.json());
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar locais');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (local: Local) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${local.id}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: !local.status })
      });
      if (!res.ok) throw new Error('Erro ao alterar status');
      fetchLocais();
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status');
    }
  };

  const salvarLocal = async (local: Local) => {
    if (!local.nome.trim() || !local.endereco.trim() || !local.telefone.trim()) {
      alert('Preencha todos os campos.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${local.id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(local)
      });
      if (!res.ok) throw new Error('Erro ao salvar local');
      fetchLocais();
      setOpenModal(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar local');
    }
  };

  const abrirModal = (local?: Local) => {
    setSelected(local || { id: 0, nome: '', endereco: '', telefone: '', status: true });
    setOpenModal(true);
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2 style={{ textAlign: 'center', width: '100%' }}>📍 Locais de Atendimento</h2>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.listagem} style={{ overflowX: 'auto' }}>
            {locais.map(local => (
              <div key={local.id} className={styles.card}>
                <div className={styles.info}>
                  <p><b>Nome:</b> {local.nome}</p>
                  <p><b>Endereço:</b> {local.endereco}</p>
                  <p><b>Telefone:</b> {local.telefone}</p>
                  <p>
                    <b>Status:</b>{' '}
                    <span className={local.status ? styles.ativo : styles.inativo}>
                      {local.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>

                <div className={styles.botoes}>
                  <button className={styles.btnEdit} onClick={() => abrirModal(local)}>Editar</button>
                  <button className={styles.btnToggle} onClick={() => toggleStatus(local)}>
                    {local.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {openModal && selected && (
          <ModalLocal
            local={selected}
            onSalvar={salvarLocal}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </>
  );
}

function ModalLocal({
  local,
  onSalvar,
  onCancelar
}: {
  local: Local;
  onSalvar: (local: Local) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(local.nome);
  const [endereco, setEndereco] = useState(local.endereco);
  const [telefone, setTelefone] = useState(local.telefone);

  const salvar = () => onSalvar({ ...local, nome, endereco, telefone });

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{local.id === 0 ? 'Novo Local' : 'Editar Local'}</h2>

        <label>Nome*</label>
        <input value={nome} onChange={e => setNome(e.target.value)} />

        <label>Endereço*</label>
        <input value={endereco} onChange={e => setEndereco(e.target.value)} />

        <label>Telefone*</label>
        <input value={telefone} onChange={e => setTelefone(e.target.value)} />

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancelar}>Cancelar</button>
          <button className={styles.saveBtn} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}