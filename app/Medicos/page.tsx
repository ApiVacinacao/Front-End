'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/navbar.module.css';
import styles from './agendamento.module.css';

type Especialidade = { id: number; nome: string };
type Medico = { id: number; nome: string; CRM: string; status: boolean; especialidade: Especialidade | null };

export default function CadastroAgendamento() {
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_paciente: '',
    data: '',
    horario: '',
    especialidade_id: '',
    medico_id: '',
  });

  // 🔹 Carregar especialidades
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/especialidades');
        const json = await response.json();

        const lista = Array.isArray(json.data) ? json.data : [];
        setEspecialidades(lista);
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
        setEspecialidades([]);
      }
    };

    fetchEspecialidades();
  }, []);

  // 🔹 Carregar médicos
  useEffect(() => {
    const fetchMedicos = async () => {
      try {
        const response = await fetch('http://localhost:8001/api/medicos');
        const json = await response.json();

        const lista = Array.isArray(json.data) ? json.data : [];
        setMedicos(lista);
      } catch (error) {
        console.error('Erro ao carregar médicos:', error);
        setMedicos([]);
      }
    };

    fetchMedicos();
  }, []);

  // 🔹 Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Agendamento cadastrado com sucesso!');
        setFormData({
          nome_paciente: '',
          data: '',
          horario: '',
          especialidade_id: '',
          medico_id: '',
        });
      } else {
        alert(result.message || 'Falha ao cadastrar agendamento');
      }
    } catch (error) {
      console.error('Erro ao cadastrar agendamento:', error);
      alert('Erro ao cadastrar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.container}>
        <h2>Cadastro de Agendamento</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nome do Paciente</label>
            <input
              type="text"
              value={formData.nome_paciente}
              onChange={(e) => setFormData({ ...formData, nome_paciente: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Horário</label>
            <input
              type="time"
              value={formData.horario}
              onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Especialidade</label>
            <select
              value={formData.especialidade_id}
              onChange={(e) => setFormData({ ...formData, especialidade_id: e.target.value })}
              required
            >
              <option value="">Selecione a especialidade</option>
              {especialidades.length > 0 &&
                especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nome}
                  </option>
                ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Médico</label>
            <select
              value={formData.medico_id}
              onChange={(e) => setFormData({ ...formData, medico_id: e.target.value })}
              required
            >
              <option value="">Selecione o médico</option>
              {medicos.length > 0 &&
                medicos
                  .filter((m) => m.status) // mostra apenas médicos ativos
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} ({m.especialidade?.nome || 'Sem especialidade'})
                    </option>
                  ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
