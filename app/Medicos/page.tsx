'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './medico.module.css';

type Especialidade = {
  id: number;
  nome: string;
};

type Medico = {
  id: number;
  nome: string;
  CRM: string;
  status: boolean;
  especialidade: Especialidade | null;
};

const API_URL = 'http://localhost:8001/api/medicos';
const API_ESPECIALIDADES = 'http://localhost:8001/api/especialidades';

export default function MedicosList() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [selected, setSelected] = useState<Medico | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEspecialidades();
    fetchMedicos();
  }, []);

  const fetchEspecialidades = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_ESPECIALIDADES, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Erro ao carregar especialidades: ${res.status}`);
      const data = await res.json();
      setEspecialidades(data);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Erro ao carregar médicos: ${res.status}`);
      const data = await res.json();
      setMedicos(data);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (medico: Medico) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${medico.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: !medico.status }),
      });
      if (!res.ok) throw new Error(`Erro ao atualizar status: ${res.status}`);
      const data = await res.json();
      setMedicos(prev => prev.map(m => m.id === data.id ? data : m));
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const salvarMedico = async (medicoAtualizado: Partial<Medico> & { id?: number }) => {
    try {
      const token = localStorage.getItem('token');
      let res: Response;

      if (medicoAtualizado.id) {
        // Atualizar
        res = await fetch(`${API_URL}/${medicoAtualizado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            nome: medicoAtualizado.nome,
            CRM: medicoAtualizado.CRM,
            status: medicoAtualizado.status,
            especialidade_id: medicoAtualizado.especialidade?.id,
          }),
        });
      } else {
        // Criar
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            nome: medicoAtualizado.nome,
            CRM: medicoAtualizado.CRM,
            status: medicoAtualizado.status ?? true,
            especialidade_id: medicoAtualizado.especialidade?.id,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Erro ao salvar médico: ${res.status}`);
      }

      const data = await res.json();
      setMedicos(prev => medicoAtualizado.id
        ? prev.map(m => m.id === data.id ? data : m)
        : [...prev, data]
      );

      setOpenDetail(false);
      setOpenNew(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Médicos Cadastrados</h2>
        </div>

        {loading ? (
          <p>Carregando médicos...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Nome</th>
                <th className={styles.th}>CRM</th>
                <th className={styles.th}>Especialidade</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map(m => (
                <tr key={m.id} className={styles.tr}>
                  <td className={styles.td}>{m.nome}</td>
                  <td className={styles.td}>{m.CRM}</td>
                  <td className={styles.td}>{m.especialidade?.nome || '-'}</td>
                  <td className={styles.td}>{m.status ? 'Ativo' : 'Inativo'}</td>
                  <td className={styles.td}>
                    <button className={styles.btnDetails} onClick={() => { setSelected(m); setOpenDetail(true); }}>
                      Ver
                    </button>
                    <button className={styles.btnToggle} onClick={() => toggleStatus(m)}>
                      {m.status ? 'Inativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className={styles.floatingBtn} onClick={() => setOpenNew(true)}>➕ Novo</button>

        {(openNew || openDetail) && selected !== null && (
          <ModalMedico
            medico={selected ?? { nome: '', CRM: '', status: true, especialidade: null }}
            especialidades={especialidades}
            onSalvar={salvarMedico}
            onCancelar={() => { setOpenDetail(false); setOpenNew(false); setSelected(null); }}
          />
        )}
      </main>
    </>
  );
}

function ModalMedico({
  medico,
  especialidades,
  onSalvar,
  onCancelar
}: {
  medico: Partial<Medico>;
  especialidades: Especialidade[];
  onSalvar: (m: Partial<Medico>) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(medico.nome ?? '');
  const [crm, setCrm] = useState(medico.CRM ?? '');
  const [status, setStatus] = useState(medico.status ?? true);
  const [especialidadeId, setEspecialidadeId] = useState<number | undefined>(medico.especialidade?.id);

  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9/ ]/g, '');
    const parts = value.split(' ');
    if (parts.length > 1) parts[1] = parts[1].slice(0, 6);
    setCrm(parts.join(' '));
  };

  const salvar = () => {
    if (!nome.trim() || !crm.trim() || !especialidadeId) {
      alert('Preencha todos os campos.');
      return;
    }
    const espSelecionada = especialidades.find(e => e.id === especialidadeId) || null;
    onSalvar({ ...medico, nome, CRM: crm, status, especialidade: espSelecionada });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{medico.id ? 'Editar Médico' : 'Novo Médico'}</h2>

        <label className={styles.modalLabel}>Nome</label>
        <input className={styles.modalInput} value={nome} onChange={e => setNome(e.target.value)} />

        <label className={styles.modalLabel}>CRM</label>
        <input className={styles.modalInput} value={crm} onChange={handleCrmChange} placeholder="CRM/SP 123456" />

        <label className={styles.modalLabel}>Especialidade</label>
        <select
          className={styles.modalInput}
          value={especialidadeId}
          onChange={e => setEspecialidadeId(Number(e.target.value))}
        >
          <option value={undefined}>Selecione</option>
          {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>

        <label className={styles.modalLabel}>Ativo</label>
        <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} />

        <div className={styles.modalButtons}>
          <button className={styles.buttonClose} onClick={onCancelar}>Cancelar</button>
          <button className={styles.buttonSubmit} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
