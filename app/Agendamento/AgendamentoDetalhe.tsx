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
  onSave?: () => void; // callback opcional após salvar
}

const DetalheAgendamento: React.FC<Props> = ({ appointment, onClose, onSave }) => {
  const [form, setForm] = useState({
    data: appointment.data,
    hora: appointment.hora,
    paciente: appointment.user?.name || '',
    profissional: appointment.medico?.nome || '',
    local: appointment.local_atendimento?.nome || '',
    tipo_consulta: appointment.tipo_consulta?.descricao || '',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');

      const dataHora = `${form.data} ${form.hora}`;

      // Monta o objeto que será enviado
      const payload = {
        ...form,
        dataHora, // nova variável combinada
      };

    try {
      const res = await fetch(`http://localhost:8000/api/agendamentos/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao salvar agendamento');

      alert('Agendamento atualizado com sucesso!');
      onClose();
      if (onSave) onSave();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar agendamento');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Editar Agendamento</h2>

        {/* Campos editáveis */}
        <label>Paciente</label>
        <input
          type="text"
          name="paciente"
          value={form.paciente}
          onChange={handleChange}
          readOnly
        />

        <label>Profissional</label>
        <input
          type="text"
          name="profissional"
          value={form.profissional}
          onChange={handleChange}
          readOnly
        />

        <label>Local</label>
        <input
          type="text"
          name="local"
          value={form.local}
          onChange={handleChange}
          readOnly
        />

        <label>Tipo Consulta</label>
        <input
          type="text"
          name="tipo_consulta"
          value={form.tipo_consulta}
          onChange={handleChange}
          readOnly
        />

        <label>Data</label>
        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
        />
        

        <label>Hora</label>
        <input
          type="time"
          name="hora"
          value={form.hora}
          onChange={handleChange}
          
        />

        {/* Botões */}
        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            className={styles.cancelButton}
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
