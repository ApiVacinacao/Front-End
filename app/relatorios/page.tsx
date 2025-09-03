'use client';

import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from '../styles/Relatorios.module.css';

interface Appointment {
  date: string;
  patient: string;
  procedure: string;
  professional: string;
  status: 'Realizado' | 'Cancelado' | 'Agendado';
}

const Relatorios: NextPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('Agendamentos por Período');
  const [professional, setProfessional] = useState('Todos');
  const [procedure, setProcedure] = useState('Todos');
  const [unit, setUnit] = useState('Todas');

  const appointments: Appointment[] = [
    {
      date: '25/10/2023',
      patient: 'Maria Oliveira',
      procedure: 'Consulta Clínica Geral',
      professional: 'Dra. Ana Silva',
      status: 'Realizado',
    },
    {
      date: '24/10/2023',
      patient: 'João Santos',
      procedure: 'Exames de Sangue',
      professional: 'Enf. Roberta Souza',
      status: 'Cancelado',
    },
    {
      date: '23/10/2023',
      patient: 'Ana Pereira',
      procedure: 'Vacinação - Gripe',
      professional: 'Enf. Carlos Mendes',
      status: 'Realizado',
    },
  ];

  const handleFilter = () => {
    console.log({ reportType, professional, startDate, endDate, procedure, unit });
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
            <h2>142</h2>
          </div>
          <div className={styles.card}>
            <p>Comparecimento</p>
            <h2>87%</h2>
          </div>
          <div className={styles.card}>
            <p>Cancelamentos</p>
            <h2>13</h2>
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
                <option>Dra. Ana Silva</option>
                <option>Enf. Roberta Souza</option>
                <option>Enf. Carlos Mendes</option>
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
                <option>Consulta Clínica Geral</option>
                <option>Exames de Sangue</option>
                <option>Vacinação - Gripe</option>
              </select>
            </div>
            <div>
              <label>Unidade</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option>Todas</option>
                <option>Unidade Centro</option>
                <option>Unidade Zona Norte</option>
                <option>Unidade Zona Sul</option>
              </select>
            </div>
          </div>
          <button className={styles.btnFilter} onClick={handleFilter}>Aplicar Filtro</button>
        </section>

        <section className={styles.reportPreview}>
          <h3>Prévia do Relatório</h3>
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
              {appointments.map((appt, idx) => (
                <tr key={idx}>
                  <td>{appt.date}</td>
                  <td>{appt.patient}</td>
                  <td>{appt.procedure}</td>
                  <td>{appt.professional}</td>
                  <td className={
                    appt.status === 'Realizado'
                      ? styles.statusRealizado
                      : appt.status === 'Cancelado'
                      ? styles.statusCancelado
                      : ''
                  }>
                    {appt.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
