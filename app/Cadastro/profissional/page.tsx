'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './medico.module.css';

interface Especialidade {
  id: number;
  nome: string;
}

const CadastroMedico: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    crm: '',
    senha: '',
    especialidade_id: '', // envia o ID para o backend
    status: true, // sempre ativo
  });

  const [mensagem, setMensagem] = useState('');
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);

  // Buscar especialidades do backend
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8001/api/especialidades', {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) setEspecialidades(data);
        else console.error('Erro ao buscar especialidades', data);
      } catch (err) {
        console.error('Erro ao conectar à API de especialidades', err);
      }
    };
    fetchEspecialidades();
  }, []);

  // Atualiza qualquer campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Formata CPF automaticamente
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setFormData({ ...formData, cpf: value });
  };

  // Formata CRM automaticamente (ex: CRM/SP 123456)
  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9/ ]/g, '');
    const parts = value.split(' ');
    if (parts.length > 1) parts[1] = parts[1].slice(0, 6); // limita números
    setFormData({ ...formData, crm: parts.join(' ') });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');

    const { nome, cpf, crm, senha, especialidade_id } = formData;
    if (!nome || !cpf || !crm || !senha || !especialidade_id) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = { ...formData, status: true }; // sempre ativo

      const res = await fetch('http://localhost:8001/api/medicos', {
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
        setFormData({ nome: '', cpf: '', crm: '', senha: '', especialidade_id: '', status: true });
      } else {
        setMensagem(data.error || 'Erro ao cadastrar médico.');
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
                >
                  <option value="">Selecione a especialidade</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>
                      {esp.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label>Senha*</label>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Crie uma senha"
                  required
                />
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
