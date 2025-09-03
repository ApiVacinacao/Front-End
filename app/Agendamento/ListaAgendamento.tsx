'use client';
import React, { useState } from 'react';
import styles from '../styles/ListaAgendamento.module.css';
import NovoAgendamento from './NovoAgendamento';
import DetalheAgendamento from './AgendamentoDetalhe';

interface Appointment {
  date: string;
  time: string;
  services: string[]; // agora é array
  professional: string;
  location: string;
  notes: string;
  patient: string;
  ativo: boolean;
}

const AgendamentosList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  const toggleAtivo = (index: number) => {
    setAppointments(prev =>
      prev.map((a, i) => i === index ? { ...a, ativo: !a.ativo } : a)
    );
  };

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
            <tr key={i} className={styles.tr}>
              <td className={styles.td}>{a.patient}</td>
              <td className={styles.td}>{a.date}</td>
              <td className={styles.td}>{a.time}</td>
              <td className={styles.td}>{a.services.join(', ')}</td>
              <td className={styles.td}>{a.professional}</td>
              <td className={styles.td}>{a.ativo ? 'Ativo' : 'Inativo'}</td>
              <td className={styles.td}>
                <button className={styles.btnDetails} onClick={() => { setSelected(a); setOpenDetail(true); }}>
                  Ver
                </button>
                <button className={styles.btnToggle} onClick={() => toggleAtivo(i)}>
                  {a.ativo ? 'Inativar' : 'Ativar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.floatingBtn} onClick={() => setOpenNew(true)}>➕ Novo</button>

      {openNew && (
        <NovoAgendamento
          onClose={() => setOpenNew(false)}
          onAddAppointment={(appointment) => { setAppointments(prev => [...prev, { ...appointment, services: Array.isArray(appointment.service) ? appointment.service : [appointment.service], ativo: true }]); setOpenNew(false); }}
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
