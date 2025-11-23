'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/page';
import ProtectedRoute from '../components/auth/protecetroute';
import styles from '../styles/Especialidade.module.css';
import Swal from "sweetalert2";

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
    <ProtectedRoute allowedRoles={"admin"}>
      <PacientesContent />
    </ProtectedRoute>
  );
}

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================
function PacientesContent() {

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

  // =============================
  // BUSCAR PACIENTES
  // =============================
  const fetchPacientes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: getHeaders()
      });

      if (!res.ok) throw new Error('Erro ao carregar pacientes');

      setPacientes(await res.json());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao carregar pacientes."
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ABRIR MODAL
  // =============================
  const abrirModal = (paciente?: Paciente) => {
    setSelected(
      paciente || {
        id: 0,
        name: '',
        email: '',
        cpf: '',
        status: true
      }
    );
    setOpenModal(true);
  };

  // =============================
  // SALVAR PACIENTE (PUT)
  // =============================
  const salvarPaciente = async (paciente: Paciente) => {

    if (!paciente.name.trim() || !paciente.email.trim() || !paciente.cpf.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Preencha todos os campos."
      });
      return;
    }

    const payload = {
      name: paciente.name,
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
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao salvar paciente."
        });
        return;
      }

      await res.json();
      fetchPacientes();
      setOpenModal(false);
      setSelected(null);

      Swal.fire({
        icon: "success",
        title: "Salvo!",
        text: "Paciente atualizado com sucesso."
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao salvar paciente."
      });
    }
  };

  // =============================
  // ALTERAR STATUS
  // =============================
  const toggleStatus = async (paciente: Paciente) => {

    const confirmar = await Swal.fire({
      icon: "question",
      title: paciente.status ? "Inativar paciente?" : "Ativar paciente?",
      text: paciente.status ? "O paciente ficará inativo." : "O paciente será reativado.",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmar.isConfirmed) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/${paciente.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) throw new Error("Erro");

      fetchPacientes();

      Swal.fire({
        icon: "success",
        title: "Status atualizado",
        text: "O status do paciente foi alterado."
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao alterar status."
      });
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
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
                  <p><b>Nome:</b> {p.name}</p>
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
                  <button className={styles.btnEdit} onClick={() => abrirModal(p)}>
                    Editar
                  </button>

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
    </ProtectedRoute>
  );
}

// =============================
// MODAL COMPLETO
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

  const salvar = () => onSalvar({ ...paciente, name, email, cpf, status });

  const cancelar = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Descartar alterações?",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    });

    if (confirm.isConfirmed) onCancelar();
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
      <div className={styles.modalOverlay} onClick={cancelar}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <h2>{paciente.id === 0 ? 'Novo Paciente' : 'Editar Paciente'}</h2>

          <label>Nome*</label>
          <input value={name} onChange={e => setNome(e.target.value)} />

          <label>Email*</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

          <label>CPF*</label>
          <input value={cpf} onChange={e => setCpf(e.target.value)} />

          <label>Status</label>
          <input
            type="checkbox"
            checked={status}
            onChange={e => setStatus(e.target.checked)}
          />

          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={cancelar}>Cancelar</button>
            <button className={styles.saveBtn} onClick={salvar}>Salvar</button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
