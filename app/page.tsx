'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css'; // seu CSS com :root e variáveis

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/Login');
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading)
    return (
      <div className="loadingWrapper">
        <div className="spinner"></div>
        <style jsx>{`
          .loadingWrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, var(--bg-start), var(--bg-end));
            font-family: 'Segoe UI', sans-serif;
          }

          .spinner {
            width: 60px;
            height: 60px;
            border: 6px solid #e0e0e0;
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );

  const options = [
    { title: 'Agendamentos', description: 'Gerencie todos os agendamentos do sistema.', path: '/Cadastro/agendamento', icon: '📅' },
    { title: 'Relatórios', description: 'Visualize e gere relatórios completos.', path: '/relatorios', icon: '📊' },
    { title: 'Locais', description: 'Gerencie os locais cadastrados no sistema.', path: '/Locais', icon: '📍' },
    { title: 'Tipos de Consulta', description: 'Configure os tipos de consulta disponíveis.', path: '/Cadastro/tipo-consulta', icon: '🩺' },
  ];

  return (
    <div className="bgContainer">
      <main className="homePage">
        <header className="header">
          <Image src="/aa.png" alt="Logo IAITEA" width={80} height={80} />
          <h1 className="title">Sistema IAITEA</h1>
          <p className="subtitle">Organização, controle e praticidade</p>
        </header>

        <section className="optionsContainer">
          {options.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="optionCard floating"
              style={{
                animation: `fadeUp 0.5s ease forwards`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span className="access">Acessar →</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
