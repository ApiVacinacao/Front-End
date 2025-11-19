'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/ListaAgendamento.module.css';
import DetalheAgendamento from './AgendamentoDetalhe';

export interface Appointment {
  id?: number;
  user_id: number;
  medico_id: number;
  local_atendimento_id: number;
  tipo_consulta_id: number;
  data: string;
  hora: string;
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

  const authHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const fetchAppointments = async () => {
    const token = getToken();
    if (!token) {
      window.location.href = '/Login';
      return;
    }

    try {
      let res = await fetch(`${API_URL}`, { headers: authHeaders() });

      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/Login';
        return;
      }

      if (res.status === 403 || res.status === 404) {
        res = await fetch(`${API_URL}/`, { headers: authHeaders() });
      }

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar agendamentos:', err);
      setAppointments([]);
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
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  const toggleStatus = async (appointment: Appointment) => {
    if (!appointment.id) return;

    try {
      const res = await fetch(`${API_URL}/${appointment.id}/toggle-status`, {
        method: 'PATCH',
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error('Erro ao alterar status do agendamento.');

      const updated: Appointment = await res.json();
      setAppointments(prev =>
        prev.map(a => (a.id === updated.id ? updated : a))
      );
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      alert('Não foi possível alterar status do agendamento.');
    }
  };

  return (
    <main className={styles.mainContent}>
      <h2 className={styles.title}>Agendamentos</h2>

      {loading && <p className={styles.loading}>Carregando agendamentos...</p>}

      {!loading && (!appointments || appointments.length === 0) && (
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
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.user?.name ?? 'Desconhecido'}</td>
                  <td>{a.data}</td>
                  <td>{a.hora}</td>
                  <td>{a.medico?.nome ?? 'Desconhecido'}</td>
                  <td>{a.local_atendimento?.nome ?? 'Desconhecido'}</td>
                  <td>{a.tipo_consulta?.descricao ?? 'Desconhecido'}</td>
                  <td>{a.status ? 'Ativo' : 'Inativo'}</td>
                  <td>
                    <button
                      className={styles.btnDetails}
                      onClick={() => openModal(a)}
                    >
                      Editar
                    </button>
                    <button
                      className={`${styles.btnToggle} ${a.status ? styles.btnAtivo : styles.btnInativo}`}
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
  );
};

export default AgendamentosList;
