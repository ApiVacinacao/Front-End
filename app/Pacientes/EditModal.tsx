'use client';

import React, { useState } from 'react';
import styles from './EditModal.module.css';

interface EditModalProps {
  paciente: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    password: string;
    status: boolean;
  };
  onClose: () => void;
  onSave: (pacienteAtualizado: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ paciente, onClose, onSave }) => {
  const [form, setForm] = useState(paciente);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Paciente</h2>

        <label>name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>password</label>
        <input type="password" name="pas" value={form.password} onChange={handleChange} />

        <label>cpf</label>
        <input type="text" name="cpf" value={form.cpf} onChange={handleChange} />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          <button onClick={handleSubmit} className={styles.saveButton}>Salvar</button>
        </div>
      </div>
    </div>

  );
};

export default EditModal;
