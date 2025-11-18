'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import { TableList } from '../components/tables/TableList';
import styles from './locais.module.css';
import modalStyles from './EditModal.module.css';

interface Local {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  status: boolean;
}

const API_URL = 'http://localhost:8000/api/localAtendimentos';

export default function Locais() {
  const [locais, setLocais] = useState<Local[]>([]);
  const [localEditando, setLocalEditando] = useState<Local | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchLocais();
  }, []);

  const fetchLocais = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Erro: ${res.status}`);
      const data = await res.json();
      setLocais(data);
    } catch (err) {
      console.error(err);
      setErro('Erro ao carregar locais');
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
      setLocais(prev => prev.map(l => (l.id === atualizado.id ? atualizado : l)));
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status');
    }
  };

  const salvarEdicao = async (local: Local) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${local.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(local),
      });
      if (!res.ok) throw new Error('Erro ao salvar local');
      const atualizado = await res.json();
      setLocais(prev => prev.map(l => (l.id === atualizado.id ? atualizado : l)));
      setLocalEditando(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar local');
    }
  };

  const columns = [
    { title: 'Nome', key: 'nome' },
    { title: 'Endereço', key: 'endereco' },
    { title: 'Telefone', key: 'telefone' },
    {
      title: 'Status',
      key: 'status',
      render: (item: Local) => (
        <span className={item.status ? styles.statusAtivo : styles.statusInativo}>
          {item.status ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'Editar',
      type: 'primary' as const,
      onClick: (local: Local) => setLocalEditando(local),
    },
    {
      label: (local: Local) => (local.status ? 'Inativar' : 'Ativar'),
      type: 'secondary' as const,
      onClick: (local: Local) => toggleStatus(local.id),
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>📍 Locais de Atendimento</h2>
        </div>

        {loading && <p className={styles.loading}>Carregando locais...</p>}
        {erro && <p className={styles.error}>{erro}</p>}

        {!loading && (
          <div className={styles.tableWrapper}>
            <TableList<Local>
              data={locais}
              columns={columns}
              actions={actions}
              title=""
              loading={loading}
            />
          </div>
        )}
      </main>

      {localEditando && (
        <ModalEditarLocal
          local={localEditando}
          onSalvar={salvarEdicao}
          onCancelar={() => setLocalEditando(null)}
        />
      )}
    </div>
  );
}

function ModalEditarLocal({
  local,
  onSalvar,
  onCancelar,
}: {
  local: Local;
  onSalvar: (local: Local) => void;
  onCancelar: () => void;
}) {
  const [form, setForm] = useState(local);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={modalStyles.overlay} onClick={onCancelar}>
      <div className={modalStyles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={modalStyles.title}>Editar Local</h3>

        <div className={modalStyles.formGroup}>
          <label>Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Digite o nome do local"
          />
        </div>

        <div className={modalStyles.formGroup}>
          <label>Endereço</label>
          <input
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Digite o endereço"
          />
        </div>

        <div className={modalStyles.formGroup}>
          <label>Telefone</label>
          <input
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(xx) xxxx-xxxx"
          />
        </div>

        <div className={modalStyles.buttons}>
          <button className={modalStyles.cancel} onClick={onCancelar}>
            Cancelar
          </button>
          <button className={modalStyles.save} onClick={() => onSalvar(form)}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
