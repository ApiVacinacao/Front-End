'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './agendamento.module.css';
import { useRouter } from 'next/navigation';

interface LocalAtendimento {
  id: number;
  nome: string;
}

interface Medico {
  id: number;
  nome: string;
}

interface Paciente {
  id: number;
  nome: string;
}

const CadastroAgendamento: React.FC = () => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [localId, setLocalId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [tipoAgendamento, setTipoAgendamento] = useState('');
  const [pacienteId, setPacienteId] = useState('');

  const [locais, setLocais] = useState<LocalAtendimento[]>([]);
  const [profissionais, setProfissionais] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const router = useRouter();

  // Buscar dados do banco
  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchLocais = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/localAtendimentos', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) setLocais(data);
      } catch (err) {
        console.error('Erro ao buscar locais:', err);
      }
    };

    const fetchProfissionais = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/medicos', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) setProfissionais(data);
      } catch (err) {
        console.error('Erro ao buscar profissionais:', err);
      }
    };

    const fetchPacientes = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/user', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) setPacientes(data);
      } catch (err) {
        console.error('Erro ao buscar pacientes:', err);
      }
    };

    fetchLocais();
    fetchProfissionais();
    fetchPacientes();
  }, []);

  const handleSubmit = async () => {
    if (!data || !hora || !localId || !profissionalId || !tipoAgendamento || !pacienteId) {
      alert('Preencha todos os campos!');
      return;
    }

    const agendamentoData = {
      data,
      hora,
      local_id: Number(localId),
      profissional_id: Number(profissionalId),
      paciente_id: Number(pacienteId),
      tipoAgendamento
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(agendamentoData),
      });

      if (response.ok) {
        alert('Agendamento cadastrado com sucesso!');
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao cadastrar agendamento!');
      }
    } catch (err) {
      console.error('Erro ao cadastrar agendamento:', err);
      alert('Erro ao cadastrar agendamento!');
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Cadastrar Agendamento</h1>

          <div className={styles.row}>
            <div className={styles.col}>
              <label>Tipo de Agendamento</label>
              <select
                value={tipoAgendamento}
                onChange={(e) => setTipoAgendamento(e.target.value)}
                className={styles.input}
              >
                <option value="">Selecione o tipo de agendamento</option>
                <option value="Atendimento Especializado">Atendimento Especializado</option>
                <option value="Consulta">Consulta</option>
                <option value="Vacina">Vacina</option>
                <option value="Exame">Exame</option>
                <option value="Emergência">Emergência</option>
              </select>
            </div>

            <div className={styles.col}>
              <label>Data</label>
              <input type="date" value={data} onChange={e => setData(e.target.value)} className={styles.input} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <label>Hora</label>
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} className={styles.input} />
            </div>

            <div className={styles.col}>
              <label>Local de Atendimento</label>
              <select
                value={localId}
                onChange={e => setLocalId(e.target.value)}
                className={styles.input}
              >
                <option value="">Selecione o local</option>
                {locais.map(local => (
                  <option key={local.id} value={local.id}>{local.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.col}>
              <label>Profissional</label>
              <select
                value={profissionalId}
                onChange={e => setProfissionalId(e.target.value)}
                className={styles.input}
              >
                <option value="">Selecione o profissional</option>
                {profissionais.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.nome}</option>
                ))}
              </select>
            </div>

            <div className={styles.col}>
              <label>Paciente</label>
              <select
                value={pacienteId}
                onChange={e => setPacienteId(e.target.value)}
                className={styles.input}
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <button className={styles.button} onClick={handleSubmit}>Cadastrar Agendamento</button>
        </div>
      </main>
    </div>
  );
};

export default CadastroAgendamento;
