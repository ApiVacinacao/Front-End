'use client';

import React, { useState } from 'react';
import styles from './EditModal.module.css';

interface EditModalProps {
  paciente: {
    id: number;
    nome: string;
    email: string;
    senha: string;
    cns: string;
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

        <label>Nome</label>
        <input type="text" name="nome" value={form.nome} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} />

        <label>Senha</label>
        <input type="password" name="senha" value={form.senha} onChange={handleChange} />

        <label>CNS</label>
        <input type="text" name="cns" value={form.cns} onChange={handleChange} />

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          <button onClick={handleSubmit} className={styles.saveButton}>Salvar</button>
        </div>
      </div>
    </div>

  );
};

export default EditModal;
