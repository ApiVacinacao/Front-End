'use client';
import React, { useState } from "react";
import styles from "../styles/NovoAgendamento.module.css";

interface Appointment {
  date: string;
  time: string;
  services: string[];     // agora é array
  professional: string;
  patient: string;
  location: string;
  notes: string;
}

interface Props {
  onClose: () => void;
  onAddAppointment: (appointment: Appointment) => void;
}

const NovoAgendamento: React.FC<Props> = ({ onClose, onAddAppointment }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    services: "",
    professional: "",
    patient: "",
    location: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      ...formData,
      services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
      notes: formData.notes || "Nenhuma observação"
    };
    onAddAppointment(newAppointment);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Agendar Novo Atendimento</h2>

        <div className={styles.row}>
          <div className={styles.col}>
            <label>Paciente</label>
            <select name="patient" value={formData.patient} onChange={handleChange} required>
              <option value="">Selecione um paciente</option>
              <option value="Paciente 1">Paciente 1</option>
              <option value="Paciente 2">Paciente 2</option>
              <option value="Paciente 3">Paciente 3</option>
            </select>
          </div>

          <div className={styles.col}>
            <label>Local</label>
            <select name="location" value={formData.location} onChange={handleChange} required>
              <option value="">Selecione o local</option>
              <option value="UBS Jardim das Flores - Sala 12">UBS Jardim das Flores - Sala 12</option>
              <option value="UBS Central - Sala 5">UBS Central - Sala 5</option>
              <option value="Clínica Olhar Certo - Sala 3">Clínica Olhar Certo - Sala 3</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <label>Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className={styles.col}>
            <label>Hora</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <label>Serviços (separar por vírgula)</label>
            <input type="text" name="services" value={formData.services} onChange={handleChange} required />
          </div>

          <div className={styles.col}>
            <label>Profissional</label>
            <input type="text" name="professional" value={formData.professional} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <label>Observações</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit">Salvar Agendamento</button>
          <button type="button" onClick={onClose}>Fechar</button>
        </div>
      </form>
    </div>
  );
};

export default NovoAgendamento;
