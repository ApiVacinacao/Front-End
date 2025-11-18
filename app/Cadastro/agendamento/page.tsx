'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar/page';
import styles from './agendamento.module.css';

interface LocalAtendimento { id: number; nome: string; }
interface Medico { id: number; nome: string; }
interface Paciente { id: number; name: string; }
interface TipoAgendamento { id: number; descricao: string; }

const CadastroAgendamento: React.FC = () => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [localAtendimentoId, setLocalAtendimentoId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [tipoAgendamento, setTipoAgendamento] = useState('');
  const [userId, setUserId] = useState('');

  const [locais, setLocais] = useState<LocalAtendimento[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [tiposAgendamento, setTiposAgendamento] = useState<TipoAgendamento[]>([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const fetchData = async () => {
      try {
        const [locaisRes, medicosRes, pacRes, tiposRes] = await Promise.all([
          fetch('http://localhost:8000/api/localAtendimentos', { headers }),
          fetch('http://localhost:8000/api/medicos', { headers }),
          fetch('http://localhost:8000/api/users', { headers }),
          fetch('http://localhost:8000/api/tipoConsultas', { headers }),
        ]);
        if (!locaisRes.ok || !medicosRes.ok || !pacRes.ok || !tiposRes.ok) {
          throw new Error('Erro ao buscar dados');
        }
        const [locaisData, medicosData, pacData, tiposData] = await Promise.all([
          locaisRes.json(),
          medicosRes.json(),
          pacRes.json(),
          tiposRes.json(),
        ]);

        setLocais(locaisData);
        setMedicos(medicosData);
        setPacientes(pacData);
        setTiposAgendamento(tiposData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        alert('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!data || !hora || !localAtendimentoId || !medicoId || !tipoAgendamento || !userId) {
      alert('Preencha todos os campos!');
      return;
    }

    const agendamentoData = {
      data,
      hora,
      local_atendimento_id: Number(localAtendimentoId),
      medico_id: Number(medicoId),
      tipo_consulta_id: Number(tipoAgendamento),
      user_id: Number(userId),
    };

    console.log('📦 Dados enviados para o backend (POST /agendamentos):', agendamentoData);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
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
        {loading ? (
          <div className="loadingWrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div className="spinner" style={{
              width: 60,
              height: 60,
              border: '6px solid #e0e0e0',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div className={styles.container}>
            <h1 className={styles.title}>Cadastrar Agendamento</h1>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Paciente</label>
                <select
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Selecione o paciente</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.col}>
                <label>Médico</label>
                <select
                  value={medicoId}
                  onChange={e => setMedicoId(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Selecione o médico</option>
                  {medicos.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Tipo de Agendamento</label>
                <select
                  value={tipoAgendamento}
                  onChange={e => setTipoAgendamento(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Selecione o tipo</option>
                  {tiposAgendamento.map(t => (
                    <option key={t.id} value={t.id}>{t.descricao}</option>
                  ))}
                </select>
              </div>
              <div className={styles.col}>
                <label>Local de Atendimento</label>
                <select
                  value={localAtendimentoId}
                  onChange={e => setLocalAtendimentoId(e.target.value)}
                  className={styles.input}
                >
                  <option value="">Selecione o local</option>
                  {locais.map(l => (
                    <option key={l.id} value={l.id}>{l.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Data</label>
                <input
                  type="date"
                  value={data}
                  onChange={e => setData(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.col}>
                <label>Hora</label>
                <input
                  type="time"
                  value={hora}
                  onChange={e => setHora(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <button className={styles.button} onClick={handleSubmit}>
              Cadastrar Agendamento
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CadastroAgendamento;
