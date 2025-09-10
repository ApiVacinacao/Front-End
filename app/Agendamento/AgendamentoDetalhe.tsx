'use client';
import React from 'react';
import styles from '../styles/DetalheAgendamento.module.css';

interface Appointment {
  id?: number;
  date: string;
  time: string;
  services: string[];
  professional: string;
  location: string;
  notes: string;
  patient: string;
  ativo?: boolean;
}

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
}

const DetalheAgendamento: React.FC<Props> = ({ appointment, onClose }) => {
  if (!appointment) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.detailCard} onClick={e => e.stopPropagation()}>
        <h1 className={styles.modalTitle}>Detalhes do Agendamento</h1>

        <div className={styles.detailGrid}>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Paciente</span>
            <span className={styles.detailValue}>{appointment.patient}</span>
          </div>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Data e Hora</span>
            <span className={styles.detailValue}>{appointment.date} - {appointment.time}</span>
          </div>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Local</span>
            <span className={styles.detailValue}>{appointment.location}</span>
          </div>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Profissional</span>
            <span className={styles.detailValue}>{appointment.professional}</span>
          </div>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Serviços</span>
            <div className={styles.serviceList}>
              {appointment.services.map((s, i) => (
                <span key={i} className={styles.serviceItem}>{s}</span>
              ))}
            </div>
          </div>
          <div className={styles.detailGridItem}>
            <span className={styles.detailLabel}>Observações</span>
            <span className={styles.detailValue}>{appointment.notes || 'Nenhuma'}</span>
          </div>
        </div>

        <button className={styles.btnSecondary} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default DetalheAgendamento;
