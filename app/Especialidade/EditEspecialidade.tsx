'use client';

import React, { useState, useEffect } from 'react';
import styles from './edit.module.css';

type Especialidade = {
  id?: number;
  nome: string;
  descricao: string;
  area: string;
  status?: boolean;
};

interface Props {
  especialidade?: Especialidade;
  onClose: () => void;
  onSave: (dados: Omit<Especialidade, 'id'>) => void;
}

export default function EspecialidadeModal({ especialidade, onClose, onSave }: Props) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    if (especialidade) {
      setNome(especialidade.nome);
      setDescricao(especialidade.descricao);
      setArea(especialidade.area);
      setStatus(especialidade.status ?? true);
    }
  }, [especialidade]);

  const handleSave = () => {
    if (!nome.trim() || !area.trim()) {
      alert('Preencha nome e área.');
      return;
    }
    onSave({ nome, descricao, area, status });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{especialidade?.id ? 'Editar Especialidade' : 'Nova Especialidade'}</h2>

        <label>Nome*</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Descrição</label>
        <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <label>Área*</label>
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">Selecione...</option>
          <option value="Médica">Médica</option>
          <option value="Enfermagem">Enfermagem</option>
          <option value="Odontologia">Odontologia</option>
          <option value="Fisioterapia">Fisioterapia</option>
          <option value="Psicologia">Psicologia</option>
          <option value="Outros">Outros</option>
        </select>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
          <button className={styles.saveButton} onClick={handleSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
