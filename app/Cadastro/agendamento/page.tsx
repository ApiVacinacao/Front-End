'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar/page';
import styles from './agendamento.module.css';
import ProtectedRoute from '@/app/components/auth/protecetroute';

interface Base { id: number; nome?: string; name?: string; descricao?: string; status: boolean; }

const CadastroAgendamento: React.FC = () => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [localAtendimentoId, setLocalAtendimentoId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [tipoAgendamento, setTipoAgendamento] = useState('');
  const [userId, setUserId] = useState('');

  const [locais, setLocais] = useState<Base[]>([]);
  const [medicos, setMedicos] = useState<Base[]>([]);
  const [pacientes, setPacientes] = useState<Base[]>([]);
  const [tiposAgendamentoList, setTiposAgendamentoList] = useState<Base[]>([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const get = (url: string) => fetch(url, { headers }).then(r => r.json());

    Promise.all([
      get('http://localhost:8000/api/localAtendimentos'),
      get('http://localhost:8000/api/medicos'),
      get('http://localhost:8000/api/users'),
      get('http://localhost:8000/api/tipoConsultas'),
    ])
      .then(([l, m, p, t]) => {
        setLocais(l.filter((i: Base) => i.status));
        setMedicos(m.filter((i: Base) => i.status));
        setPacientes(p.filter((i: Base) => i.status));
        setTiposAgendamentoList(t.filter((i: Base) => i.status));
      })
      .catch(() => alert('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!data || !hora || !localAtendimentoId || !medicoId || !tipoAgendamento || !userId) {
      alert('Preencha todos os campos!');
      return;
    }

    const token = localStorage.getItem('token');
    const body = {
      data,
      hora,
      local_atendimento_id: Number(localAtendimentoId),
      medico_id: Number(medicoId),
      tipo_consulta_id: Number(tipoAgendamento),
      user_id: Number(userId),
    };

    try {
      const res = await fetch('http://localhost:8000/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        alert('Agendamento registrado com sucesso!');
        router.push('/Agendamento'); // <-- REDIRECIONA DIRETO
        return;
      }

      const err = await res.json();
      alert(err.message || 'Erro ao cadastrar.');
    } catch {
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <ProtectedRoute allowedRoles={"admin"}>
          <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>

        {loading ? (
          <div className="loadingWrapper"><div className="spinner" /></div>
        ) : (
          <div className={styles.container}>
            <h1 className={styles.title}>Cadastrar Agendamento</h1>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Paciente</label>
                <select value={userId} onChange={e => setUserId(e.target.value)} className={styles.input}>
                  <option value="">Selecione</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.col}>
                <label>Médico</label>
                <select value={medicoId} onChange={e => setMedicoId(e.target.value)} className={styles.input}>
                  <option value="">Selecione</option>
                  {medicos.map(m => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Tipo</label>
                <select value={tipoAgendamento} onChange={e => setTipoAgendamento(e.target.value)} className={styles.input}>
                  <option value="">Selecione</option>
                  {tiposAgendamentoList.map(t => (
                    <option key={t.id} value={t.id}>{t.descricao}</option>
                  ))}
                </select>
              </div>

              <div className={styles.col}>
                <label>Local</label>
                <select value={localAtendimentoId} onChange={e => setLocalAtendimentoId(e.target.value)} className={styles.input}>
                  <option value="">Selecione</option>
                  {locais.map(l => (
                    <option key={l.id} value={l.id}>{l.nome}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Data</label>
                <input type="date" value={data} onChange={e => setData(e.target.value)} className={styles.input} />
              </div>

              <div className={styles.col}>
                <label>Hora</label>
                <input type="time" value={hora} onChange={e => setHora(e.target.value)} className={styles.input} />
              </div>
            </div>

            <button className={styles.button} onClick={handleSubmit}>
              Cadastrar Agendamento
            </button>
          </div>
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
};

export default CadastroAgendamento;