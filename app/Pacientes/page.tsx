'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './paciente.module.css'; // seu CSS enviado
import modalStyles from './EditModal.module.css';

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
  const [openNew, setOpenNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: !paciente.status }),
      });
      if (!res.ok) throw new Error(`Erro ao atualizar status: ${res.status}`);
      const data = await res.json();
      setPacientes(prev => prev.map(p => p.id === data.id ? data : p));
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const salvarPaciente = async (pacienteAtualizado: Partial<Paciente> & { id?: number }) => {
    try {
      const token = localStorage.getItem('token');
      let res: Response;

      if (pacienteAtualizado.id) {
        res = await fetch(`${API_URL}/${pacienteAtualizado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(pacienteAtualizado),
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            name: pacienteAtualizado.name,
            email: pacienteAtualizado.email,
            cpf: pacienteAtualizado.cpf,
            status: pacienteAtualizado.status ?? true,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Erro ao salvar paciente: ${res.status}`);
      }

      const data = await res.json();
      setPacientes(prev => pacienteAtualizado.id ? prev.map(p => p.id === data.id ? data : p) : [...prev, data]);
      setPacienteEditando(null);
      setOpenNew(false);
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

          {loading ? (
            <p>Carregando pacientes...</p>
          ) : (
            <table className={styles.lista}>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>CPF</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.email}</td>
                    <td>{p.cpf}</td>
                    <td className={styles.status}>
                      <span className={p.status ? styles.status : styles.instatus}>
                        {p.status ? 'Ativo' : 'Instatus'}
                      </span>
                    </td>
                    <td>
                      <button className={styles.editButton} onClick={() => setPacienteEditando(p)}>Editar</button>
                      <button className={styles.deleteButton} onClick={() => toggleAtivo(p)}>
                        {p.status ? 'Inativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button className={styles.floatingBtn} onClick={() => setOpenNew(true)}>➕ Novo</button>
        </div>
      </main>

      {(pacienteEditando || openNew) && (
        <ModalPaciente
          paciente={pacienteEditando ?? { name: '', email: '', cpf: '', status: true }}
          onSalvar={salvarPaciente}
          onCancelar={() => { setPacienteEditando(null); setOpenNew(false); }}
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
    if (!name.trim() || !email.trim() || !cpf.trim()) {
      alert('Preencha todos os campos.');
      return;
    }
    onSalvar({ ...paciente, name, email, cpf, status });
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <h2 className={modalStyles.modalTitle}>{paciente.id ? 'Editar Paciente' : 'Novo Paciente'}</h2>

        <label className={modalStyles.modalLabel}>Nome</label>
        <input className={modalStyles.modalInput} value={name} onChange={e => setNome(e.target.value)} />

        <label className={modalStyles.modalLabel}>Email</label>
        <input className={modalStyles.modalInput} type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label className={modalStyles.modalLabel}>Cpf</label>
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
