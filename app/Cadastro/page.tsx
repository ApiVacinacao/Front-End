'use client';

import Link from 'next/link';
import Navbar from '../components/navbar/page';
import styles from '../styles/Cadastro.module.css';
import { useRouter } from 'next/navigation';

const CadastroPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Escolha o tipo de cadastro</h1>
          <div className={styles.buttonsWrapper}>
            <button className={styles.card} onClick={() => router.push('/Cadastro/paciente')}>
              🧍‍♂️ Cadastrar Paciente
            </button>
            <button className={styles.card} onClick={() => router.push('/Cadastro/profissional')}>
              🩺 Cadastrar Profissional
            </button>
            <button className={styles.card} onClick={() => router.push('/Cadastro/local')}>
              🏥 Cadastrar Local de Atendimento
            </button>
            <button className={styles.card} onClick={() => router.push('/Cadastro/agendamento')}>
              📅 Cadastrar Agendamento
            </button>
            <button className={styles.card} onClick={() => router.push('/Cadastro/users')}>
              🧍‍♂️ Cadastrar Usuário
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CadastroPage;
