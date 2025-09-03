'use client';

import React, { useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from './paciente.module.css';
import modalStyles from './EditModal.module.css';

interface Paciente {
  id: number;
  nome: string;
  email: string;
  cns: string;
  ativo: boolean;
}

const Pacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([
    { id: 1, nome: 'João Silva', email: 'joao@example.com', cns: '12345678900', ativo: true },
    { id: 2, nome: 'Maria Souza', email: 'maria@example.com', cns: '98765432100', ativo: true },
    { id: 3, nome: 'Carlos Oliveira', email: 'carlos@example.com', cns: '45678912300', ativo: true },
  ]);

  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);

  const editarPaciente = (id: number) => {
    const paciente = pacientes.find(p => p.id === id);
    if (paciente) setPacienteEditando(paciente);
  };

  const salvarEdicao = (atualizado: Paciente) => {
    setPacientes(prev => prev.map(p => (p.id === atualizado.id ? atualizado : p)));
    setPacienteEditando(null);
  };

  const inativarPaciente = (id: number) => {
    setPacientes(prev =>
      prev.map(p => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pacienteEditando) {
      setPacienteEditando({ ...pacienteEditando, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Lista de Pacientes</h1>
          <table className={styles.lista}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CNS</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.email}</td>
                  <td>{p.cns}</td>
                  <td className={styles.status}>
                    <span className={p.ativo ? styles.ativo : styles.inativo}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <button className={styles.editButton} onClick={() => editarPaciente(p.id)}>Editar</button>
                    <button className={styles.deleteButton} onClick={() => inativarPaciente(p.id)}>
                      {p.ativo ? 'Inativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {pacienteEditando && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modalContent}>
            <h2>Editar Paciente</h2>

            <label>Nome</label>
            <input type="text" name="nome" value={pacienteEditando.nome} onChange={handleInputChange} />

            <label>Email</label>
            <input type="email" name="email" value={pacienteEditando.email} onChange={handleInputChange} />

            <label>CNS</label>
            <input type="text" name="cns" value={pacienteEditando.cns} onChange={handleInputChange} />

            <div className={modalStyles.actions}>
              <button onClick={() => setPacienteEditando(null)}>Cancelar</button>
              <button onClick={() => salvarEdicao(pacienteEditando)} className={modalStyles.saveButton}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Pacientes;
