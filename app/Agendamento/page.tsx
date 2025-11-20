'use client';
import React from 'react';
import AgendamentosList from '../Agendamento/ListaAgendamento';
import Sidebar from '../components/navbar/page';

const AgendamentosPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      <div style={{boxShadow: '2px 0 8px rgba(0,0,0,0.05)', zIndex: 10 }}>
        <Sidebar />
      </div>

      <main
        style={{
          flex: 1,
          padding: '2.5rem 3rem',
          backgroundColor: '#ffffff',
          borderTopLeftRadius: '1rem',
          minHeight: '100vh',
        }}
      >
        <AgendamentosList />
      </main>
    </div>
  );
};

export default AgendamentosPage;
