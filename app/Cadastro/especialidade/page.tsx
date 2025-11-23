'use client';

import React, { useState } from 'react';
import Navbar from '../../components/navbar/page';
import styles from './especialidade.module.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/auth/protecetroute';

const CadastroEspecialidade: React.FC = () => {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [area, setArea] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nome.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Preencha o nome da especialidade.',
            });
            return;
        }

        if (!area) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Selecione uma área.',
            });
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Usuário não autenticado.',
            });
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/especialidades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome,
                    descricao,
                    area,
                    status: true,
                }),
            });

            if (!res.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao cadastrar especialidade.',
                });
                return;
            }

            const data = await res.json();

            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: `Especialidade "${data.nome}" cadastrada com sucesso!`,
                timer: 1500,
                showConfirmButton: false,
            });

            setNome('');
            setDescricao('');
            setArea('');

            setTimeout(() => {
                router.push('/Especialidade');
            }, 1500);

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Erro na comunicação com o servidor.',
            });
            console.error(error);
        }
    };

    return (
        <ProtectedRoute allowedRoles={"admin"}>
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

                        <button type="submit" className={styles.button}>
                            Cadastrar
                        </button>
                    </form>
                </div>
            </main>
        </div>
        </ProtectedRoute>

    );
};

export default CadastroEspecialidade;