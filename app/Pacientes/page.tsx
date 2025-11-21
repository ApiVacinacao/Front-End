'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Especialidade.module.css';

type Paciente = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  status: boolean;
};

const API_URL = 'http://localhost:8000/api/users';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selected, setSelected] = useState<Paciente | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) headers.append('Authorization', `Bearer ${token}`);
    return headers;
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error('Erro ao carregar pacientes');
      setPacientes(await res.json());
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ABRIR MODAL
  // =============================
  const abrirModal = (paciente?: Paciente) => {
    setSelected(
      paciente || { id: 0, nome: '', email: '', cpf: '', status: true }
    );
    setOpenModal(true);
  };

  // =============================
  // SALVAR (PUT)
  // =============================
  const salvarPaciente = async (paciente: Paciente) => {
    if (!paciente.nome.trim() || !paciente.email.trim() || !paciente.cpf.trim()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      nome: paciente.nome,
      email: paciente.email,
      cpf: paciente.cpf,
      status: paciente.status,
    };

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/${paciente.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao salvar paciente');
      await res.json();
      fetchPacientes();
      setOpenModal(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar paciente');
    }
  };

  // =============================
  // ALTERAR STATUS
  // =============================
  const toggleStatus = async (paciente: Paciente) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${paciente.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: !paciente.status }),
      });
      if (!res.ok) throw new Error('Erro ao alterar status');
      fetchPacientes();
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
          <h2>Listagem de Pacientes</h2>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.listagem}>
            {pacientes.map(p => (
              <div key={p.id} className={styles.card}>
                <div className={styles.info}>
                  <p><b>Nome:</b> {p.nome}</p>
                  <p><b>Email:</b> {p.email}</p>
                  <p><b>CPF:</b> {p.cpf}</p>
                  <p>
                    <b>Status:</b>{' '}
                    <span className={p.status ? styles.ativo : styles.inativo}>
                      {p.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </p>
                </div>

                <div className={styles.botoes}>
                  <button className={styles.btnEdit} onClick={() => abrirModal(p)}>Editar</button>
                  <button className={styles.btnToggle} onClick={() => toggleStatus(p)}>
                    {p.status ? 'Inativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {openModal && selected && (
          <ModalPaciente
            paciente={selected}
            onSalvar={salvarPaciente}
            onCancelar={() => setOpenModal(false)}
          />
        )}
      </main>
    </>
  );
}

// =============================
// MODAL PACIENTE
// =============================
function ModalPaciente({
  paciente,
  onSalvar,
  onCancelar
}: {
  paciente: Paciente;
  onSalvar: (p: Paciente) => void;
  onCancelar: () => void;
}) {
  const [nome, setNome] = useState(paciente.nome);
  const [email, setEmail] = useState(paciente.email);
  const [cpf, setCpf] = useState(paciente.cpf);
  const [status, setStatus] = useState(paciente.status);

  const salvar = () => onSalvar({ ...paciente, nome, email, cpf, status });

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{paciente.id === 0 ? 'Novo Paciente' : 'Editar Paciente'}</h2>

        <label>Nome*</label>
        <input value={nome} onChange={e => setNome(e.target.value)} />

        <label>Email*</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label>CPF*</label>
        <input value={cpf} onChange={e => setCpf(e.target.value)} />

        <label>Status</label>
        <input type="checkbox" checked={status} onChange={e => setStatus(e.target.checked)} />

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancelar}>Cancelar</button>
          <button className={styles.saveBtn} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
