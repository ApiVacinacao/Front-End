'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './medico.module.css';

interface Especialidade {
  id: number;
  nome: string;
  status: number; // 0 ou 1
}

const CadastroMedico: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    crm: '',
    especialidade_id: '',
  });
  const [mensagem, setMensagem] = useState('');
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8000/api/especialidades', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) {
          const ativas = data.filter((esp: Especialidade) => esp.status === 1);
          setEspecialidades(ativas);
        }
      } catch (err) {
        console.error('Erro ao conectar à API de especialidades', err);
      }
    };
    fetchEspecialidades();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData({ ...formData, cpf: value });
  };

  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9/ ]/g, '');
    setFormData({ ...formData, crm: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    const { nome, cpf, crm, especialidade_id } = formData;
    if (!nome || !cpf || !crm || !especialidade_id)
      return setMensagem('Preencha todos os campos obrigatórios.');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        nome,
        cpf: cpf.replace(/\D/g, ''),
        CRM: crm.toUpperCase(),
        especialidade_id: Number(especialidade_id),
        status: 1,
      };

      const res = await fetch('http://localhost:8000/api/medicos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagem(`Médico ${data.nome} cadastrado com sucesso!`);
        setFormData({ nome: '', cpf: '', crm: '', especialidade_id: '' });
      } else {
        if (data.errors) {
          // Trata erros da validação do Laravel (422)
          const mensagens = Object.values(data.errors)
            .flat()
            .join(' | ');

          setMensagem(mensagens);
        } else {
          setMensagem(data.message || 'Erro ao cadastrar médico.');
        }
      }
    } catch (err) {
      console.error('Erro:', err);
      setMensagem('Erro ao cadastrar médico.');
    }
  };


  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.formContainer}>
          <h1>Cadastro de Médico</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.col}>
                <label>Nome*</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div className={styles.col}>
                <label>CPF*</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>CRM*</label>
                <input
                  type="text"
                  name="crm"
                  value={formData.crm}
                  onChange={handleCrmChange}
                  placeholder="CRM/SP 123456"
                  required
                />
              </div>
              <div className={styles.col}>
                <label>Especialidade*</label>
                <select
                  name="especialidade_id"
                  value={formData.especialidade_id}
                  onChange={handleChange}
                  required
                  disabled={especialidades.length === 0}
                >
                  <option value="">
                    {especialidades.length === 0 ? 'Carregando...' : 'Selecione a especialidade'}
                  </option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit">Cadastrar</button>
            {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
          </form>
        </div>
      </main>
    </>
  );
};

export default CadastroMedico;
