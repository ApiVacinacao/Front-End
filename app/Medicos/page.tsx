'use client';
import React, { useState } from 'react';
import Navbar from '../components/navbar/page';
import styles from './medico.module.css';

type Medico = {
  id: number;
  nome: string;
  crm: string;
  ativo: boolean;
};

const medicosMock: Medico[] = [
  { id: 1, nome: 'Dr. João Silva', crm: '123456', ativo: true },
  { id: 2, nome: 'Dra. Maria Souza', crm: '654321', ativo: true },
  { id: 3, nome: 'Dr. Carlos Oliveira', crm: '987654', ativo: false },
];

export default function MedicosList() {
  const [medicos, setMedicos] = useState<Medico[]>(medicosMock);
  const [selected, setSelected] = useState<Medico | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openNew, setOpenNew] = useState(false);

  const toggleAtivo = (index: number) => {
    setMedicos(prev =>
      prev.map((m, i) => i === index ? { ...m, ativo: !m.ativo } : m)
    );
  };

  const salvarMedico = (medicoAtualizado: Medico) => {
    setMedicos(prev =>
      prev.map(m => m.id === medicoAtualizado.id ? medicoAtualizado : m)
    );
    setOpenDetail(false);
    setSelected(null);
  };

  return (
    <body>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Médicos Cadastrados</h2>
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar médicos..." />
          <button>🔍</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nome</th>
              <th className={styles.th}>CRM</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((m, i) => (
              <tr key={m.id} className={styles.tr}>
                <td className={styles.td}>{m.nome}</td>
                <td className={styles.td}>{m.crm}</td>
                <td className={styles.td}>{m.ativo ? 'Ativo' : 'Inativo'}</td>
                <td className={styles.td}>
                  <button
                    className={styles.btnDetails}
                    onClick={() => { setSelected(m); setOpenDetail(true); }}
                  >
                    Ver
                  </button>
                  <button
                    className={styles.btnToggle}
                    onClick={() => toggleAtivo(i)}
                  >
                    {m.ativo ? 'Inativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className={styles.floatingBtn} onClick={() => setOpenNew(true)}>➕ Novo</button>

        {openNew && (
          <ModalMedico
            medico={{ id: 0, nome: '', crm: '', ativo: true }}
            onSalvar={(m) => { setMedicos(prev => [...prev, { ...m, id: prev.length + 1 }]); setOpenNew(false); }}
            onCancelar={() => setOpenNew(false)}
          />
        )}

        {openDetail && selected && (
          <ModalMedico
            medico={selected}
            onSalvar={salvarMedico}
            onCancelar={() => { setOpenDetail(false); setSelected(null); }}
          />
        )}
      </main>
    </body>
  );
}

function ModalMedico({ medico, onSalvar, onCancelar }: { medico: Medico; onSalvar: (m: Medico) => void; onCancelar: () => void }) {
  const [nome, setNome] = useState(medico.nome);
  const [crm, setCrm] = useState(medico.crm);

  const salvar = () => {
    if (!nome.trim() || !crm.trim()) {
      alert('Preencha todos os campos.');
      return;
    }
    onSalvar({ ...medico, nome, crm });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Editar Médico</h2>

        <label className={styles.modalLabel}>Nome</label>
        <input className={styles.modalInput} value={nome} onChange={e => setNome(e.target.value)} />

        <label className={styles.modalLabel}>CRM</label>
        <input className={styles.modalInput} value={crm} onChange={e => setCrm(e.target.value)} />

        <div className={styles.modalButtons}>
          <button className={styles.buttonClose} onClick={onCancelar}>Cancelar</button>
          <button className={styles.buttonSubmit} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
