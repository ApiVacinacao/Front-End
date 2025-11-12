'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './medico.module.css';
import { TableList } from '../components/tables/TableList';

type Especialidade = { id: number; nome: string; };
type Medico = { id: number; nome: string; CRM: string; status: boolean; especialidade: Especialidade | null; };

const API_URL = 'http://localhost:8000/api/medicos';
const API_ESPECIALIDADES = 'http://localhost:8000/api/especialidades';

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
      const res = await fetch(API_ESPECIALIDADES, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Erro ao carregar especialidades');
      const data = await res.json();
      setEspecialidades(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar especialidades');
    }
  };

  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Erro ao carregar médicos');
      const data = await res.json();
      setMedicos(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar médicos');
    } finally { setLoading(false); }
  };

  const toggleStatus = async (medico: Medico) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${medico.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ status: !medico.status }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      const data: Medico = await res.json();
      setMedicos(prev => prev.map(m => (m.id === data.id ? { ...m, status: data.status } : m)));
    } catch (err) { console.error(err); alert('Erro ao atualizar status'); }
  };

  const salvarMedico = async (medicoAtualizado: Partial<Medico> & { id?: number }) => {
    try {
      const token = localStorage.getItem('token');
      let res: Response;

      if (medicoAtualizado.id) {
        res = await fetch(`${API_URL}/${medicoAtualizado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ nome: medicoAtualizado.nome, CRM: medicoAtualizado.CRM, especialidade_id: medicoAtualizado.especialidade?.id }),
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ nome: medicoAtualizado.nome, CRM: medicoAtualizado.CRM, status: medicoAtualizado.status ?? true, especialidade_id: medicoAtualizado.especialidade?.id }),
        });
      }

      if (!res.ok) throw new Error('Erro ao salvar médico');
      const data = await res.json();
      setMedicos(prev => medicoAtualizado.id ? prev.map(m => (m.id === data.id ? data : m)) : [...prev, data]);
      setOpenDetail(false); setOpenNew(false); setSelected(null);
    } catch (err) { console.error(err); alert('Erro ao salvar médico'); }
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <h2>Médicos Cadastrados</h2>

        <TableList
          data={medicos}
          loading={loading}
          columns={[
            { title: 'Nome', key: 'nome' },
            { title: 'CRM', key: 'CRM' },
            { title: 'Especialidade', key: 'especialidade', render: m => m.especialidade?.nome || '-' },
            { title: 'Status', key: 'status', render: m => <span className={m.status ? styles.status : styles.instatus}>{m.status ? 'Ativo' : 'Inativo'}</span> },
          ]}
          actions={[
            { label: 'Ver', onClick: (m) => { setSelected(m); setOpenDetail(true); }, className: styles.btnDetails },
            { label: (m: any) => m.status ? 'Inativar' : 'Ativar', onClick: toggleStatus, className: styles.btnToggle },
          ]}
        />

        {(openNew || openDetail) && (
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

function ModalMedico({ medico, especialidades, onSalvar, onCancelar }: { medico: Partial<Medico>; especialidades: Especialidade[]; onSalvar: (m: Partial<Medico>) => void; onCancelar: () => void }) {
  const [nome, setNome] = useState(medico.nome ?? '');
  const [crm, setCrm] = useState(medico.CRM ?? '');
  const [status, setStatus] = useState(medico.status ?? true);
  const [especialidadeId, setEspecialidadeId] = useState<number | ''>(medico.especialidade?.id ?? '');

  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9/ ]/g, '');
    const parts = value.split(' ');
    if (parts.length > 1) parts[1] = parts[1].slice(0, 6);
    setCrm(parts.join(' '));
  };

  const salvar = () => {
    if (!nome.trim() || !crm.trim() || !especialidadeId) return alert('Preencha todos os campos.');
    const espSelecionada = especialidades.find(e => e.id === Number(especialidadeId)) || null;
    onSalvar({ ...medico, nome, CRM: crm, status, especialidade: espSelecionada });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{medico.id ? 'Editar Médico' : 'Novo Médico'}</h2>
        <label>Nome</label>
        <input value={nome} onChange={e => setNome(e.target.value)} />
        <label>CRM</label>
        <input value={crm} onChange={handleCrmChange} placeholder="CRM/SP 123456" />
        <label>Especialidade</label>
        <select value={especialidadeId} onChange={e => setEspecialidadeId(Number(e.target.value))}>
          <option value="">Selecione</option>
          {especialidades.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
        </select>
        <label>
          <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} /> Ativo
        </label>
        <div className={styles.modalButtons}>
          <button onClick={onCancelar}>Cancelar</button>
          <button onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
