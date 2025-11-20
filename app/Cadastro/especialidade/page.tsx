'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './especialidade.module.css';

const CadastroEspecialidade: React.FC = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [area, setArea] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensagem('');

        if (!nome.trim()) {
            setMensagem('Por favor, preencha o nome da especialidade.');
            return;
        }

        if (!area) {
            setMensagem('Por favor, selecione uma área.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setMensagem('Usuário não autenticado.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/especialidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    nome, 
                    descricao, 
                    area, 
                    status: true // sempre ativo
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Erro da API:', text);
                setMensagem('Erro ao cadastrar especialidade.');
                return;
            }

            const data = await res.json();
            setMensagem(`Especialidade "${data.nome}" cadastrada com sucesso!`);
            setNome('');
            setDescricao('');
            setArea('');
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            setMensagem('Erro ao cadastrar especialidade.');
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Cadastro de Especialidade</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Nome*</label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Ex: Cardiologia"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.col}>
                                <label>Descrição</label>
                                <input
                                    type="text"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Ex: Especialidade do coração"
                                    className={styles.input}
                                />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.col}>
                                <label>Área*</label>
                                <select
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className={styles.input}
                                    required
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Medica">Médica</option>
                                    <option value="Enfermagem">Enfermagem</option>
                                    <option value="Odontologia">Odontologia</option>
                                    <option value="Fisioterapia">Fisioterapia</option>
                                    <option value="Psicologia">Psicologia</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className={styles.button}>Cadastrar</button>

                        {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CadastroEspecialidade;
