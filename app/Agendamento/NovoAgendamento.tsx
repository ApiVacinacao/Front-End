'use client';
import React, { useState } from "react";
import styles from "../styles/NovoAgendamento.module.css";

interface Appointment {
  date: string;
  time: string;
  service: string;
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
    service: "",
    professional: "",
    patient: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = { ...formData, notes: "Nenhuma observação" };
    onAddAppointment(newAppointment);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Agendar Novo Atendimento</h2>

        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Paciente</label>
            <select name="patient" value={formData.patient} onChange={handleChange} className={styles.selectInput} required>
              <option value="">Selecione um paciente</option>
              <option value="Paciente 1">Paciente 1</option>
              <option value="Paciente 2">Paciente 2</option>
              <option value="Paciente 3">Paciente 3</option>
            </select>
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Local</label>
            <select name="location" value={formData.location} onChange={handleChange} className={styles.selectInput} required>
              <option value="">Selecione o local</option>
              <option value="UBS Jardim das Flores - Sala 12">UBS Jardim das Flores - Sala 12</option>
              <option value="UBS Central - Sala 5">UBS Central - Sala 5</option>
              <option value="Clínica Olhar Certo - Sala 3">Clínica Olhar Certo - Sala 3</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Data</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={styles.input} required />
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Hora</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} className={styles.input} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Serviço</label>
            <input type="text" name="service" value={formData.service} onChange={handleChange} className={styles.input} required />
          </div>

          <div className={styles.col}>
            <label className={styles.label}>Profissional</label>
            <input type="text" name="professional" value={formData.professional} onChange={handleChange} className={styles.input} required />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.buttonSubmit}>Salvar Agendamento</button>
          <button type="button" className={styles.buttonClose} onClick={onClose}>Fechar</button>
        </div>
      </form>
    </div>
  );
};

export default NovoAgendamento;
