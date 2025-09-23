'use client';
import React, { useState } from 'react';
import styles from '../styles/DetalheAgendamento.module.css';

interface Appointment {
  id?: number;
  data: string;
  hora: string;
  user?: { name: string };
  medico?: { nome: string };
  local_atendimento?: { nome: string };
  tipo_consulta?: { descricao: string };
}

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

const DetalheAgendamento: React.FC<Props> = ({ appointment, onClose }) => {
  const [form, setForm] = useState({
    data: appointment.data,
    hora: appointment.hora,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8000/api/agendamentos/${appointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Erro ao salvar agendamento');

      alert('Agendamento atualizado com sucesso!');
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar agendamento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.detailCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.modalTitle}>Editar Agendamento</h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#555',
            }}
          >
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Paciente</span>
            <span className={styles.detailValue}>{appointment.user?.name}</span>
          </div>

          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Profissional</span>
            <span className={styles.detailValue}>{appointment.medico?.nome}</span>
          </div>

          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Local</span>
            <span className={styles.detailValue}>{appointment.local_atendimento?.nome}</span>
          </div>

          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Tipo Consulta</span>
            <span className={styles.detailValue}>{appointment.tipo_consulta?.descricao}</span>
          </div>

          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Data</span>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className={styles.detailValue}
            />
          </div>

          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Hora</span>
            <input
              type="time"
              name="hora"
              value={form.hora}
              onChange={handleChange}
              className={styles.detailValue}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
          <button className={styles.btnSecondary} onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            className={styles.btnSecondary}
            style={{ background: '#ef4444' }}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalheAgendamento;
