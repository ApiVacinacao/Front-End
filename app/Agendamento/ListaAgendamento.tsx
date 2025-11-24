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
  dataHora?: string;
}

const API_URL = 'http://localhost:8000/api/agendamentos';

export default function AgendamentosList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const getToken = () => localStorage.getItem('token');
  const headers = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  const fetchData = async () => {
    if (!getToken()) return (window.location.href = '/Login');

    try {
      let res = await fetch(API_URL, { headers: headers() });

      if (res.status === 401) {
        localStorage.removeItem('token');
        return (window.location.href = '/Login');
      }

      const data = await res.json();

      const formatted = data.map((i: any) => {
        if (i.data && i.hora) return i;
        if (!i.dataHora) return i;
        const [d, h] = i.dataHora.split(' ');
        return { ...i, data: d, hora: h.slice(0, 5) };
      });

      setAppointments(formatted);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleStatus = async (a: Appointment) => {
    if (!a.id) return;

    const res = await fetch(`${API_URL}/${a.id}/toggle-status`, {
      method: 'PATCH',
      headers: headers(),
    });

    if (!res.ok) return alert('Erro ao alterar status');

    const { status } = await res.json();

    setAppointments(prev =>
      prev.map(x => (x.id === a.id ? { ...x, status } : x))
    );
  };

  return (
    <main className={styles.mainContent}>
      <h2 className={styles.title}>Agendamentos</h2>

      {loading && <p className={styles.loading}>Carregando...</p>}
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
                <th>Consulta</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td data-label="Paciente">{a.user?.name}</td>
                  <td data-label="Data">{a.data}</td>
                  <td data-label="Hora">{a.hora}</td>
                  <td data-label="Profissional">{a.medico?.nome}</td>
                  <td data-label="Local">{a.local_atendimento?.nome}</td>
                  <td data-label="Consulta">{a.tipo_consulta?.descricao}</td>

                  <td
                    data-label="Status"
                    className={a.status ? styles.active : styles.inactive}
                  >
                    {a.status ? 'Ativo' : 'Inativo'}
                  </td>

                  <td className={styles.actionsCell}>
                    <button
                      className={styles.btnDetails}
                      onClick={() => setSelected(a)}
                    >
                      Editar
                    </button>

                    <button
                      className={
                        a.status ? styles.btnInativar : styles.btnAtivar
                      }
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

      {selected && (
        <DetalheAgendamento
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdate={updated =>
            setAppointments(prev =>
              prev.map(a => (a.id === updated.id ? updated : a))
            )
          }
        />
      )}
    </main>
  );
}
