'use client';

import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Relatorios.module.css';

interface Appointment {
  id: number;
  data: string;
  paciente: string;
  procedimento: string;
  profissional: string;
  status: 'Realizado' | 'Cancelado' | 'Agendado';
}

const Relatorios: NextPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('Agendamentos por Período');
  const [professional, setProfessional] = useState('Todos');
  const [procedure, setProcedure] = useState('Todos');
  const [unit, setUnit] = useState('Todas');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('dataInicial', startDate);
      if (endDate) params.append('dataFinal', endDate);
      if (professional !== 'Todos') params.append('medico_id', professional);
      if (procedure !== 'Todos') params.append('tipo_consulta_id', procedure);
      if (unit !== 'Todas') params.append('local_atendimento_id', unit);

      const res = await fetch(`http://localhost:8000/api/relatorios/agendamentos?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar agendamentos');
      const data = await res.json();

      // Map para se adaptar à interface local
      const mapped: Appointment[] = data.map((item: any) => ({
        id: item.id,
        data: item.data,
        paciente: item.user?.name || item.paciente || '---',
        procedimento: item.tipoConsulta?.nome || item.procedimento || '---',
        profissional: item.medico?.nome || item.profissional || '---',
        status: item.status || 'Agendado',
      }));

      setAppointments(mapped);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar os agendamentos.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleFilter = () => {
    fetchAppointments();
  };

  const exportPDF = () => console.log('Exportando PDF...');
  const exportExcel = () => console.log('Exportando Excel...');
  const printReport = () => console.log('Imprimindo...');

  return (
    <>
      <Head>
        <title>Relatórios</title>
        <meta name="description" content="Página de relatórios do sistema" />
      </Head>

      <Navbar />

      <main className={styles.mainContent}>
        <h1>Relatórios</h1>

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
          <h3>Filtrar Relatório</h3>
          <div className={styles.filterGrid}>
            <div>
              <label>Tipo de Relatório</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option>Agendamentos por Período</option>
                <option>Comparecimento por Profissional</option>
                <option>Cancelamentos por Mês</option>
              </select>
            </div>
            <div>
              <label>Profissional</label>
              <select value={professional} onChange={(e) => setProfessional(e.target.value)}>
                <option>Todos</option>
                <option value="1">Dra. Ana Silva</option>
                <option value="2">Enf. Roberta Souza</option>
                <option value="3">Enf. Carlos Mendes</option>
              </select>
            </div>
            <div>
              <label>Período Inicial</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label>Período Final</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
              <label>Procedimento</label>
              <select value={procedure} onChange={(e) => setProcedure(e.target.value)}>
                <option>Todos</option>
                <option value="1">Consulta Clínica Geral</option>
                <option value="2">Exames de Sangue</option>
                <option value="3">Vacinação - Gripe</option>
              </select>
            </div>
            <div>
              <label>Unidade</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option>Todas</option>
                <option value="1">Unidade Centro</option>
                <option value="2">Unidade Zona Norte</option>
                <option value="3">Unidade Zona Sul</option>
              </select>
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
                  <th>Paciente</th>
                  <th>Procedimento</th>
                  <th>Profissional</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.data}</td>
                    <td>{appt.paciente}</td>
                    <td>{appt.procedimento}</td>
                    <td>{appt.profissional}</td>
                    <td className={appt.status === 'Realizado' ? styles.statusRealizado : appt.status === 'Cancelado' ? styles.statusCancelado : ''}>
                      {appt.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className={styles.actions}>
            <button className={styles.btnExport} onClick={exportPDF}>Exportar PDF</button>
            <button className={styles.btnExport} onClick={exportExcel}>Exportar Excel</button>
            <button className={styles.btnPrint} onClick={printReport}>Imprimir</button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Relatorios;
