'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Relatorios.module.css';

interface Appointment {
  id: number;
  data: string;
  hora?: string;
  status?: 'Agendado' | 'Realizado' | 'Cancelado';
  user?: { id: number; name: string };
  medico?: { id: number; nome: string; CRM?: string; especialidade?: { nome: string } };
  tipo_consulta?: { id: number; descricao: string };
  local_atendimento?: { id: number; nome: string };
}

const RelatoriosPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Filtros
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('data_inicial', startDate);
      if (endDate) params.append('data_final', endDate);

      const res = await fetch(`http://localhost:8001/api/relatorios/agendamentos?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar agendamentos');
      const data: Appointment[] = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar os agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFilter = () => {
    fetchAppointments();
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <h1>Relatórios de Agendamentos</h1>

        <div className={styles.cards}>
          <div className={styles.card}>
            <p>Total de Agendamentos</p>
            <h2>{appointments.length}</h2>
          </div>
          <div className={styles.card}>
            <p>Comparecimento</p>
            <h2>{appointments.filter(a => a.status === 'Realizado').length}</h2>
          </div>
          <div className={styles.card}>
            <p>Cancelamentos</p>
            <h2>{appointments.filter(a => a.status === 'Cancelado').length}</h2>
          </div>
        </div>

        <section className={styles.filterSection}>
          <h3>Filtros</h3>
          <div className={styles.filterGrid}>
            <div>
              <label>Período Inicial</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label>Período Final</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <button className={styles.btnFilter} onClick={handleFilter}>Aplicar Filtro</button>
        </section>

        <section className={styles.reportPreview}>
          <h3>Prévia do Relatório</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Hora</th>
                  <th>Paciente</th>
                  <th>Profissional</th>
                  <th>Especialidade</th>
                  <th>CRM</th>
                  <th>Tipo Consulta</th>
                  <th>Local Atendimento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    <td>{a.data}</td>
                    <td>{a.hora || '-'}</td>
                    <td>{a.user?.name || '-'}</td>
                    <td>{a.medico?.nome || '-'}</td>
                    <td>{a.medico?.especialidade?.nome || '-'}</td>
                    <td>{a.medico?.CRM || '-'}</td>
                    <td>{a.tipo_consulta?.descricao || '-'}</td>
                    <td>{a.local_atendimento?.nome || '-'}</td>
                    <td className={
                      a.status === 'Realizado'
                        ? styles.statusRealizado
                        : a.status === 'Cancelado'
                        ? styles.statusCancelado
                        : ''
                    }>
                      {a.status || 'Agendado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </>
  );
};

export default RelatoriosPage;
