'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/ListaAgendamento.module.css';
import { useRouter } from 'next/navigation';

export interface Appointment {
  id?: number;
  user_id: number;
  medico_id: number;
  local_atendimento_id: number;
  tipo_consulta_id: number;
  date: string;
  time: string;
  services: string[];
  ativo: boolean;

  user?: { id: number; name: string };
  medico?: { id: number; nome: string };
  local_atendimento?: { id: number; descricao: string };
  tipo_consulta?: { id: number; descricao: string };
}

const API_URL = 'http://localhost:8001/api/agendamentos';

const AgendamentosList: React.FC = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const authHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/Login');
      return;
    }

    (async () => {
      try {
        const res = await fetch(API_URL, { headers: authHeaders() });
        if (res.status === 401) {
          localStorage.removeItem('token');
          router.replace('/Login');
          return;
        }
        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const toggleStatus = async (id: number, ativo: boolean) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ ativo: !ativo }),
      });
      if (!res.ok) throw new Error('Erro ao alterar status');
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ativo: !ativo } : a))
      );
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status');
    }
  };

  const editarAgendamento = (id: number) => {
    router.push(`/agendamentos/editar/${id}`);
  };

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Agendamentos</h2>
        </div>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.header}>
        <h2>Agendamentos</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Paciente</th>
            <th className={styles.th}>Data</th>
            <th className={styles.th}>Hora</th>
            <th className={styles.th}>Profissional</th>
            <th className={styles.th}>Local</th>
            <th className={styles.th}>Tipo Consulta</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id ?? i} className={styles.tr}>
              <td className={styles.td}>{a.user?.name ?? 'Desconhecido'}</td>
              <td className={styles.td}>{a.date}</td>
              <td className={styles.td}>{a.time}</td>
              <td className={styles.td}>{a.medico?.nome ?? 'Desconhecido'}</td>
              <td className={styles.td}>
                {a.local_atendimento?.descricao ?? 'Desconhecido'}
              </td>
              <td className={styles.td}>
                {a.tipo_consulta?.descricao ?? 'Desconhecido'}
              </td>
              <td className={a.ativo ? styles.ativo : styles.inativo}>
                {a.ativo ? 'Ativo' : 'Inativo'}
              </td>
              <td className={styles.td}>
                <button
                  className={styles.btnDetails}
                  onClick={() => editarAgendamento(a.id!)}
                >
                  Editar
                </button>
                <button
                  className={styles.btnToggle}
                  onClick={() => toggleStatus(a.id!, a.ativo)}
                >
                  {a.ativo ? 'Inativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr>
              <td className={styles.td} colSpan={9}>
                Nenhum agendamento encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default AgendamentosList;
