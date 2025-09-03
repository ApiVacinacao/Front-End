"use client";
import React, { useState } from 'react';
import styles from './AgendaConsulta.module.css';
import Sidebar from '../components/navbar/page';

interface Consulta {
  nome: string;
  especialidade: string;
  data: string;
  hora: string;
}

const AgendaConsulta: React.FC = () => {
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('Clínico Geral');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  const agendarConsulta = () => {
    if (!nome || !data || !hora) {
      alert('Preencha todos os campos!');
      return;
    }

    const novaConsulta: Consulta = { nome, especialidade, data, hora };
    setConsultas([...consultas, novaConsulta]);

    setNome('');
    setData('');
    setHora('');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className={styles.container}>
        <h1 className={styles.header}>Agendar Consulta</h1>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nome do Paciente</label>
            <input 
              className={styles.input}
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Especialidade</label>
            <select 
              className={styles.select}
              value={especialidade} 
              onChange={(e) => setEspecialidade(e.target.value)}
            >
              <option>Clínico Geral</option>
              <option>Pediatria</option>
              <option>Cardiologia</option>
              <option>Dermatologia</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Data</label>
            <input 
              type="date" 
              className={styles.input}
              value={data} 
              onChange={(e) => setData(e.target.value)} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Hora</label>
            <input 
              type="time" 
              className={styles.input}
              value={hora} 
              onChange={(e) => setHora(e.target.value)} 
            />
          </div>
        </div>

        <button className={styles.button} onClick={agendarConsulta}>
          Agendar Consulta
        </button>

        <div className={styles.consultasList}>
          <h2 className={styles.header}>Consultas Agendadas</h2>
          {consultas.map((c, index) => (
            <div key={index} className={styles.consultaCard}>
              <p><strong>Paciente:</strong> {c.nome}</p>
              <p><strong>Especialidade:</strong> {c.especialidade}</p>
              <p><strong>Data:</strong> {c.data} às {c.hora}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgendaConsulta;
