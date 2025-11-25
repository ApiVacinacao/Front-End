'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import ProtectedRoute from '../components/auth/protecetroute';
import styles from '../styles/Especialidade.module.css';
import Swal from 'sweetalert2';

type Paciente = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  status: boolean;
};

const API_URL = 'http://localhost:8000/api/users';

export default function PacientesPage() {
  return (
    <ProtectedRoute allowedRoles="admin">
      <PacientesContent />
    </ProtectedRoute>
  );
}

// =============================
// COMPONENTE PRINCIPAL
// =============================
function PacientesContent() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selected, setSelected] = useState<Paciente | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  // =============================
  // BUSCAR PACIENTES
  // =============================
  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error();
      setPacientes(await res.json());
    } catch {
      Swal.fire('Erro', 'Erro ao carregar pacientes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ABRIR MODAL
  // =============================
  const abrirModal = (paciente?: Paciente) => {
    setSelected(
      paciente || { id: 0, name: '', email: '', cpf: '', status: true }
    );
    setOpenModal(true);
  };

  // =============================
  // SALVAR PACIENTE
  // =============================
  const salvarPaciente = async (paciente: Paciente) => {
    if (!paciente.name.trim() || !paciente.email.trim() || !paciente.cpf.trim()) {
      Swal.fire('Atenção', 'Preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    const payload = {
      name: paciente.name,
      email: paciente.email,
      cpf: paciente.cpf,
      status: paciente.status,
    };

    try {
      const method = paciente.id === 0 ? 'POST' : 'PUT';
      const url = paciente.id === 0 ? API_URL : `${API_URL}/${paciente.id}`;

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        Swal.fire('Erro', data.message || 'Erro ao salvar paciente.', 'error');
        return;
      }

      fetchPacientes();
      setOpenModal(false);
      setSelected(null);

      Swal.fire('Sucesso', 'Paciente salvo com sucesso!', 'success');
    } catch {
      Swal.fire('Erro', 'Erro ao salvar paciente.', 'error');
    }
  };

  // =============================
  // ALTERAR STATUS
  // =============================
  const toggleStatus = async (paciente: Paciente) => {
    const confirmar = await Swal.fire({
      title: paciente.status ? 'Inativar paciente?' : 'Ativar paciente?',
      text: `O paciente ficará ${paciente.status ? 'inativo' : 'ativo'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${paciente.id}/status`, {
        method: 'PATCH',
        headers: getHeaders()
      });

      if (!res.ok) {
        const data = await res.json();
        Swal.fire('Erro', data.error || 'Erro ao alterar status.', 'error');
        return;
      }

      fetchPacientes();
      Swal.fire('Sucesso', 'Status alterado com sucesso!', 'success');
    } catch {
      Swal.fire('Erro', 'Erro ao alterar status.', 'error');
    }
  };

  return (
    <>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Listagem de Pacientes</h2>
          <button className={styles.addBtn} onClick={() => abrirModal()}>
            + Novo Paciente
          </button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className={styles.listagem}>
            {pacientes.map(p => (
              <div key={p.id} className={styles.card}>
                <div className={styles.info}>
                  <p><b>Nome:</b> {p.name}</p>
                  <p><b>Email:</b> {p.email}</p>
                  <p><b>CPF:</b> {p.cpf}</p>
                  <p>
                    <b>Status:</b>
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
// MODAL DO PACIENTE
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
  const [name, setNome] = useState(paciente.name);
  const [email, setEmail] = useState(paciente.email);
  const [cpf, setCpf] = useState(paciente.cpf);
  const [status, setStatus] = useState(paciente.status);

  const salvar = () => {
    onSalvar({ ...paciente, name, email, cpf, status });
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancelar}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>{paciente.id === 0 ? 'Novo Paciente' : 'Editar Paciente'}</h2>

        <label>Nome*</label>
        <input value={name} onChange={e => setNome(e.target.value)} />

        <label>Email*</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

        <label>CPF*</label>
        <input value={cpf} onChange={e => setCpf(e.target.value)} />

        <label>Status</label>
        <select value={status ? 1 : 0} onChange={e => setStatus(Number(e.target.value) === 1)}>
          <option value={1}>Ativo</option>
          <option value={0}>Inativo</option>
        </select>

        <div className={styles.modalActions}>
          <button className={styles.cancelBtn} onClick={onCancelar}>Cancelar</button>
          <button className={styles.saveBtn} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
