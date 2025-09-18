'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './paciente.module.css'; // seu CSS enviado
import modalStyles from './EditModal.module.css';

interface Paciente {
  id: number;
  nome: string;
  email: string;
  cns: string;
  ativo: boolean;
}

const API_URL = 'http://localhost:8001/api/pacientes';

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
        body: JSON.stringify({ ativo: !paciente.ativo }),
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
            nome: pacienteAtualizado.nome,
            email: pacienteAtualizado.email,
            cns: pacienteAtualizado.cns,
            ativo: pacienteAtualizado.ativo ?? true,
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
                  <th>CNS</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map(p => (
                  <tr key={p.id}>
                    <td>{p.nome}</td>
                    <td>{p.email}</td>
                    <td>{p.cns}</td>
                    <td className={styles.status}>
                      <span className={p.ativo ? styles.ativo : styles.inativo}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <button className={styles.editButton} onClick={() => setPacienteEditando(p)}>Editar</button>
                      <button className={styles.deleteButton} onClick={() => toggleAtivo(p)}>
                        {p.ativo ? 'Inativar' : 'Ativar'}
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
          paciente={pacienteEditando ?? { nome: '', email: '', cns: '', ativo: true }}
          onSalvar={salvarPaciente}
          onCancelar={() => { setPacienteEditando(null); setOpenNew(false); }}
        />
      )}
    </>
  );
}

function ModalPaciente({ paciente, onSalvar, onCancelar }: { paciente: Partial<Paciente>; onSalvar: (p: Partial<Paciente>) => void; onCancelar: () => void }) {
  const [nome, setNome] = useState(paciente.nome ?? '');
  const [email, setEmail] = useState(paciente.email ?? '');
  const [cns, setCns] = useState(paciente.cns ?? '');
  const [ativo, setAtivo] = useState(paciente.ativo ?? true);

  const salvar = () => {
    if (!nome.trim() || !email.trim() || !cns.trim()) {
      alert('Preencha todos os campos.');
      return;
    }
    onSalvar({ ...paciente, nome, email, cns, ativo });
  };

  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modalContent}>
        <h2 className={modalStyles.modalTitle}>{paciente.id ? 'Editar Paciente' : 'Novo Paciente'}</h2>

        <label className={modalStyles.modalLabel}>Nome</label>
        <input className={modalStyles.modalInput} value={nome} onChange={e => setNome(e.target.value)} />

        <label className={modalStyles.modalLabel}>Email</label>
        <input className={modalStyles.modalInput} type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label className={modalStyles.modalLabel}>CNS</label>
        <input className={modalStyles.modalInput} value={cns} onChange={e => setCns(e.target.value)} />

        <label className={modalStyles.modalLabel}>Ativo</label>
        <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} />

        <div className={modalStyles.actions}>
          <button onClick={onCancelar}>Cancelar</button>
          <button className={modalStyles.saveButton} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
