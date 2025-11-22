'use client';

import { useState, useEffect } from 'react';
import styles from '../../styles/Relatorios.module.css';
import Navbar from '@/app/components/navbar/page';
import ProtectedRoute from '@/app/components/auth/protecetroute';

interface Appointment {
  id: number;
  data: string;
  hora?: string;
  status?: 'Agendado' | 'Realizado' | 'Cancelado';
  user?: { id: number; name?: string };
  medico?: { id?: number; nome?: string; CRM?: string };
  tipo_consulta?: { descricao?: string };
  local_atendimento?: { nome?: string };
}

interface Medico {
  id: number;
  nome: string;
}

const API_URL = 'http://localhost:8000/api/relatorios/agendamentos';
const API_MEDICOS = 'http://localhost:8000/api/medicos';

const RelatoriosPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [medicoId, setMedicoId] = useState('');

  const [medicos, setMedicos] = useState<Medico[]>([]);

  const getToken = () => localStorage.getItem('token');

  // 🔹 Carregar médicos para o select
  const fetchMedicos = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(API_MEDICOS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMedicos(data);
    } catch {
      console.log('Erro ao carregar médicos');
    }
  };

  const fetchAppointments = async () => {
    const token = getToken();
    if (!token) {
      alert('Você precisa estar logado.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data_inicial: startDate || null,
          data_final: endDate || null,
          medico_id: medicoId || null,
          user_id: null,
          local_atendimento_id: null,
          tipo_consulta_id: null,
        }),
      });

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
    fetchMedicos();
    fetchAppointments();
  }, []);

  const handleFilter = () => fetchAppointments();

  const exportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const doc = new jsPDF();

    const logoUrl = '/aa.png';
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      const width = 25;
      const aspectRatio = img.height / img.width;
      const height = width * aspectRatio;

      const pageWidth = doc.internal.pageSize.getWidth();
      const centerX = (pageWidth - width) / 2;

      doc.addImage(img, 'PNG', centerX, 10, width, height);
      doc.setFontSize(18);
      doc.text('Relatório de Agendamentos', pageWidth / 2, 10 + height + 10, { align: 'center' });

      autoTableModule.default(doc, {
        startY: 10 + height + 20,
        head: [['Data', 'Hora', 'Paciente', 'Profissional', 'CRM', 'Tipo Consulta', 'Local', 'Status']],
        body: appointments.map(a => [
          a.data,
          a.hora || '-',
          a.user?.name || '-',
          a.medico?.nome || '-',
          a.medico?.CRM || '-',
          a.tipo_consulta?.descricao || '-',
          a.local_atendimento?.nome || '-',
          a.status || 'Agendado',
        ]),
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
        bodyStyles: { halign: 'center' },
        theme: 'grid',
      });

      doc.save('relatorio_agendamentos.pdf');
    };
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
          <>
      <Navbar />
      <main className={styles.mainContent}>
        <h1>Relatórios de Medicos</h1>

        <section className={styles.filterSection}>
          <h3>Filtros</h3>

          <div className={styles.filterGrid}>
            <div>
              <label>Data Inicial</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>

            <div>
              <label>Data Final</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>

            <div>
              <label>Profissional</label>
              <select value={medicoId} onChange={e => setMedicoId(e.target.value)}>
                <option value="">Todos</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterButtons}>
            <button className={styles.btnFilter} onClick={handleFilter}>Aplicar Filtro</button>
            <button className={styles.btnFilter} onClick={exportPDF}>Exportar PDF</button>
          </div>

        </section>
   <section className={styles.reportPreview}>
          <div className={styles.reportCard}>
            <h3>Prévia do Relatório</h3>

            {loading ? (
              <p>Carregando...</p>
            ) : appointments.length === 0 ? (
              <p>Nenhum agendamento encontrado.</p>
            ) : (
              <table className={styles.reportTable}>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Paciente</th>
                    <th>Profissional</th>
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
                      <td>{a.medico?.CRM || '-'}</td>
                      <td>{a.tipo_consulta?.descricao || '-'}</td>
                      <td>{a.local_atendimento?.nome || '-'}</td>
                      <td
                        className={
                          a.status === 'Realizado'
                            ? styles.statusRealizado
                            : a.status === 'Cancelado'
                              ? styles.statusCancelado
                              : ''
                        }
                      >
                        {a.status || 'Agendado'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </>
    </ProtectedRoute>

  );
};

export default RelatoriosPage;
