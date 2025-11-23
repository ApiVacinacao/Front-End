'use client';

import React, { useEffect, useState } from 'react';
import styles from '../styles/ListaAgendamento.module.css';
import DetalheAgendamento from './AgendamentoDetalhe';
import Swal from 'sweetalert2';
import ProtectedRoute from '../components/auth/protecetroute';

export interface Appointment {
  id?: number;
  user_id: number;
  medico_id: number;
  local_atendimento_id: number;
  tipo_consulta_id: number;
  data: string; // backend manda um campo só (datetime)
  hora?: string;
  status?: boolean;
  user?: { id: number; name: string };
  medico?: { id: number; nome: string };
  local_atendimento?: { id: number; nome: string };
  tipo_consulta?: { id: number; descricao: string };
}

const API_URL = 'http://localhost:8000/api/agendamentos';

const AgendamentosList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const getToken = () => localStorage.getItem('token');
  const getRole = () => localStorage.getItem('role');
  const getUserId = () => localStorage.getItem('user_id');

  const authHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const redirectLogin = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Sessão expirada',
      text: 'Faça login novamente.',
    });
    window.location.href = '/Login';
  };

  // 🔥 FORMATAÇÃO LOCAL (SEM DEPENDER DO BACK)
  const formatarDataHora = (dataStr: string) => {
    if (!dataStr) return { data: '-', hora: '-' };

    const d = new Date(dataStr);
    if (isNaN(d.getTime())) return { data: '-', hora: '-' };

    const data = d.toLocaleDateString('pt-BR');
    const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return { data, hora };
  };

  const fetchAppointments = async () => {
    const token = getToken();
    const role = getRole();
    const user_id = getUserId();

    if (!token) return redirectLogin();

    try {
      let url = API_URL;

      // 🔥 user → só dele
      if (role === 'user' && user_id) {
        url = `${API_URL}?user_id=${user_id}`;
      }

      const res = await fetch(url, { headers: authHeaders() });

      if (res.status === 401) {
        localStorage.removeItem('token');
        return redirectLogin();
      }

      const data = await res.json();

      // 🔥 AQUI EU FORMATO DATA/HORA
      const ajustado = data.map((item: Appointment) => {
        const { data, hora } = formatarDataHora(item.data);
        return { ...item, data_formatada: data, hora_formatada: hora };
      });

      setAppointments(ajustado);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível carregar os agendamentos.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const openModal = (appointment: Appointment) => setSelectedAppointment(appointment);
  const closeModal = () => setSelectedAppointment(null);

  const handleUpdate = (updated: Appointment) => {
    const { data, hora } = formatarDataHora(updated.data);
    setAppointments(prev =>
      prev.map(a =>
        a.id === updated.id ? { ...updated, data_formatada: data, hora_formatada: hora } : a
      )
    );
  };

  const toggleStatus = async (appointment: Appointment) => {
    if (!appointment.id) return;

    const confirmar = await Swal.fire({
      icon: 'question',
      title: appointment.status ? 'Inativar agendamento?' : 'Ativar agendamento?',
      text: 'Deseja realmente alterar o status?',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${appointment.id}/toggle-status`, {
        method: 'PATCH',
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error('Erro ao alterar status');

      const { status } = await res.json();

      setAppointments(prev =>
        prev.map(a => (a.id === appointment.id ? { ...a, status } : a))
      );

      Swal.fire({
        icon: 'success',
        title: 'Status atualizado',
        text: `Agora está ${status ? 'Ativo' : 'Inativo'}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível alterar o status.',
      });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <main className={styles.mainContent}>
        <h2 className={styles.title}>Agendamentos</h2>

        {loading && <p className={styles.loading}>Carregando agendamentos...</p>}
        {!loading && appointments.length === 0 && (
          <p className={styles.empty}>Nenhum agendamento encontrado.</p>
        )}

        {!loading && appointments.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Profissional</th>
                  <th>Local</th>
                  <th>Tipo Consulta</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td>{a.user?.name ?? 'Desconhecido'}</td>
                    <td>{a.data_formatada}</td>
                    <td>{a.hora_formatada}</td>
                    <td>{a.medico?.nome ?? 'Desconhecido'}</td>
                    <td>{a.local_atendimento?.nome ?? 'Desconhecido'}</td>
                    <td>{a.tipo_consulta?.descricao ?? 'Desconhecido'}</td>
                    <td>{a.status ? 'Ativo' : 'Inativo'}</td>

                    <td className="actionsCell">
                      <button className={styles.btnDetails} onClick={() => openModal(a)}>
                        Editar
                      </button>

                      <button
                        className={`${styles.btnToggle} ${a.status ? styles.btnInativar : styles.btnAtivar}`}
                        onClick={() => toggleStatus(a)}
                      >
                        {a.status ? 'Inativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedAppointment && (
          <DetalheAgendamento
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdate}
          />
        )}
      </main>
    </ProtectedRoute>
  );
};

export default AgendamentosList;
