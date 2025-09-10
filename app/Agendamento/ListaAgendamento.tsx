'use client';
import React, { useEffect, useState } from 'react';
import styles from '../styles/ListaAgendamento.module.css';
import NovoAgendamento from './NovoAgendamento';
import DetalheAgendamento from './AgendamentoDetalhe';
import { useRouter } from 'next/navigation';

interface Appointment {
  id?: number;
  date: string;
  time: string;
  services: string[];     // array no front
  professional: string;
  location: string;
  notes: string;
  patient: string;
  ativo: boolean;
}

const API_BASE = 'http://localhost:8000/api';
const API_URL = `${API_BASE}/agendamentos`;

const AgendamentosList: React.FC = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

  const authHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const normalizeToArray = (payload: any): Appointment[] => {
    // aceita [ ... ] ou { data: [...] } ; senão, array vazio
    if (Array.isArray(payload)) return payload as Appointment[];
    if (payload && Array.isArray(payload.data)) return payload.data as Appointment[];
    return [];
  };

  // 🔹 Carregar lista
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
        const list = normalizeToArray(data).map((a: any) => ({
          ...a,
          // garante services como array no front, mesmo se vier string/JSON
          services: Array.isArray(a.services)
            ? a.services
            : typeof a.services === 'string'
              ? (() => {
                  try { const parsed = JSON.parse(a.services); return Array.isArray(parsed) ? parsed : [a.services]; }
                  catch { return a.services.split(',').map((s: string) => s.trim()).filter(Boolean); }
                })()
              : [],
          ativo: Boolean(a.ativo),
        }));
        setAppointments(list);
      } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Criar
  const addAppointment = async (appointment: Partial<Appointment>) => {
    try {
      const payload = {
        ...appointment,
        services: Array.isArray(appointment.services)
          ? appointment.services
          : appointment && (appointment as any).service
            ? (Array.isArray((appointment as any).service)
                ? (appointment as any).service
                : [String((appointment as any).service)])
            : [],
        ativo: appointment.ativo ?? true,
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.replace('/Login');
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Erro ao criar agendamento');
      }

      const created = await res.json();
      setAppointments(prev => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert('Não foi possível criar o agendamento.');
    }
  };

  // 🔹 Ativar/Inativar
  const toggleAtivo = async (index: number) => {
    const appt = appointments[index];
    if (!appt?.id) return;

    const updated = { ...appt, ativo: !appt.ativo };

    try {
      const res = await fetch(`${API_URL}/${appt.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updated),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.replace('/Login');
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Erro ao atualizar status');
      }

      setAppointments(prev => prev.map((a, i) => (i === index ? updated : a)));
    } catch (err) {
      console.error(err);
      alert('Não foi possível atualizar o status.');
    }
  };

  // 🔹 Deletar
  const deleteAppointment = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.replace('/Login');
        return;
      }

      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'Erro ao excluir');
      }

      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Não foi possível excluir o agendamento.');
    }
  };

  if (loading) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.header}><h2>Agendamentos</h2></div>
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.header}><h2>Agendamentos</h2></div>

      <div className={styles.searchBar}>
        <input type="text" placeholder="Buscar agendamentos..." />
        <button>🔍</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Paciente</th>
            <th className={styles.th}>Data</th>
            <th className={styles.th}>Hora</th>
            <th className={styles.th}>Serviço</th>
            <th className={styles.th}>Profissional</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, i) => (
            <tr key={a.id ?? i} className={styles.tr}>
              <td className={styles.td}>{a.patient}</td>
              <td className={styles.td}>{a.date}</td>
              <td className={styles.td}>{a.time}</td>
              <td className={styles.td}>
                {Array.isArray(a.services) ? a.services.join(', ') : String(a.services ?? '')}
              </td>
              <td className={styles.td}>{a.professional}</td>
              <td className={styles.td}>{a.ativo ? 'Ativo' : 'Inativo'}</td>
              <td className={styles.td}>
                <button
                  className={styles.btnDetails}
                  onClick={() => { setSelected(a); setOpenDetail(true); }}
                >
                  Ver
                </button>
                <button
                  className={styles.btnToggle}
                  onClick={() => toggleAtivo(i)}
                >
                  {a.ativo ? 'Inativar' : 'Ativar'}
                </button>
                <button
                  className={styles.btnDelete}
                  onClick={() => deleteAppointment(a.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {appointments.length === 0 && (
            <tr><td className={styles.td} colSpan={7}>Nenhum agendamento encontrado.</td></tr>
          )}
        </tbody>
      </table>

      <button className={styles.floatingBtn} onClick={() => setOpenNew(true)}>➕ Novo</button>

      {openNew && (
        <NovoAgendamento
          onClose={() => setOpenNew(false)}
          onAddAppointment={(appointment: Appointment) => {
            addAppointment(appointment);
            setOpenNew(false);
          }}
        />
      )}

      {openDetail && selected && (
        <DetalheAgendamento
          appointment={selected}
          onClose={() => { setOpenDetail(false); setSelected(null); }}
        />
      )}
    </main>
  );
};

export default AgendamentosList;
