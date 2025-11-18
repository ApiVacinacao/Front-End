'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './paciente.module.css';
import modalStyles from './EditModal.module.css';
import { TableList } from '../components/tables/TableList';

interface Paciente {
  id: number;
  name: string;
  email: string;
  cpf: string;
  status: boolean;
}

const API_URL = 'http://localhost:8000/api/users';

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error(`Erro ao carregar pacientes: ${res.status}`);
      const data = await res.json();
      setPacientes(data);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (paciente: Paciente) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${paciente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...paciente, status: !paciente.status }),
      });
      if (!res.ok) throw new Error('Erro ao atualizar status');
      const data = await res.json();
      setPacientes(prev => prev.map(p => (p.id === data.id ? data : p)));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o status do paciente.');
    }
  };

  const salvarPaciente = async (pacienteAtualizado: Partial<Paciente> & { id?: number }) => {
    if (!pacienteAtualizado.id) return alert('Não é permitido adicionar novos pacientes.');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${pacienteAtualizado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(pacienteAtualizado),
      });
      if (!res.ok) throw new Error('Erro ao salvar paciente');
      const data = await res.json();
      setPacientes(prev => prev.map(p => (p.id === data.id ? data : p)));
      setPacienteEditando(null);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Lista de Pacientes</h1>

          <TableList
            data={pacientes}
            loading={loading}
            columns={[
              { title: 'Nome', key: 'name' },
              { title: 'Email', key: 'email' },
              { title: 'CPF', key: 'cpf' },
              { title: 'Status', key: 'status', render: (p) => <span className={p.status ? styles.status : styles.instatus}>{p.status ? 'Ativo' : 'Inativo'}</span> },
            ]}
            actions={[
              { label: 'Editar', onClick: setPacienteEditando, className: styles.editButton },
              { label: (p: any) => p.status ? 'Inativar' : 'Ativar', onClick: toggleAtivo, className: styles.deleteButton },
            ]}
          />
        </div>
      </main>

      {pacienteEditando && (
        <ModalPaciente
          paciente={pacienteEditando}
          onSalvar={salvarPaciente}
          onCancelar={() => setPacienteEditando(null)}
        />
      )}
    </>
  );
}

function ModalPaciente({ paciente, onSalvar, onCancelar }: { paciente: Partial<Paciente>; onSalvar: (p: Partial<Paciente>) => void; onCancelar: () => void }) {
  const [name, setNome] = useState(paciente.name ?? '');
  const [email, setEmail] = useState(paciente.email ?? '');
  const [cpf, setCpf] = useState(paciente.cpf ?? '');
  const [status, setAtivo] = useState(paciente.status ?? true);

  const salvar = () => {
    if (!name.trim() || !email.trim() || !cpf.trim()) return alert('Preencha todos os campos.');
    onSalvar({ ...paciente, name, email, cpf, status });
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <h2 className={modalStyles.modalTitle}>Editar Paciente</h2>
        <label className={modalStyles.modalLabel}>Nome</label>
        <input className={modalStyles.modalInput} value={name} onChange={e => setNome(e.target.value)} />
        <label className={modalStyles.modalLabel}>Email</label>
        <input className={modalStyles.modalInput} type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label className={modalStyles.modalLabel}>CPF</label>
        <input className={modalStyles.modalInput} value={cpf} onChange={e => setCpf(e.target.value)} />
        <label className={modalStyles.modalLabel}>Ativo</label>
        <input type="checkbox" checked={status} onChange={e => setAtivo(e.target.checked)} />
        <div className={modalStyles.actions}>
          <button onClick={onCancelar}>Cancelar</button>
          <button className={modalStyles.saveButton} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
