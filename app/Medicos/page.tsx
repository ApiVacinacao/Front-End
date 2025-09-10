'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/page';
import styles from './medico.module.css';

type Medico = {
  id: number;
  nome: string;
  crm: string;
  ativo: boolean;
};

const API_URL = 'http://localhost:8000/api/medicos'; // ajuste para sua rota real

export default function MedicosList() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [selected, setSelected] = useState<Medico | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openNew, setOpenNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Buscar médicos da API
  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // se houver autenticação
      const res = await fetch(API_URL, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Erro ao carregar médicos: ${res.status}`);
      const data = await res.json();
      setMedicos(data);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (medico: Medico) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${medico.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ativo: !medico.ativo }),
      });
      if (!res.ok) throw new Error(`Erro ao atualizar status: ${res.status}`);
      const data = await res.json();
      setMedicos(prev => prev.map(m => m.id === data.id ? data : m));
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  const salvarMedico = async (medicoAtualizado: Partial<Medico> & { id?: number }) => {
    try {
      const token = localStorage.getItem('token');
      let res: Response;

      if (medicoAtualizado.id) {
        // edição
        res = await fetch(`${API_URL}/${medicoAtualizado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(medicoAtualizado),
        });
      } else {
        // criação
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            nome: medicoAtualizado.nome,
            crm: medicoAtualizado.crm,
            ativo: medicoAtualizado.ativo ?? true,
          }),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Erro ao salvar médico: ${res.status}`);
      }

      const data = await res.json();
      // atualizar lista
      setMedicos(prev => {
        if (medicoAtualizado.id) {
          return prev.map(m => m.id === data.id ? data : m);
        } else {
          return [...prev, data];
        }
      });
      setOpenDetail(false);
      setOpenNew(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h2>Médicos Cadastrados</h2>
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar médicos..." />
          <button>🔍</button>
        </div>

        {loading ? (
          <p>Carregando médicos...</p>
        ) : (
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
              {medicos.map(m => (
                <tr key={m.id} className={styles.tr}>
                  <td className={styles.td}>{m.nome}</td>
                  <td className={styles.td}>{m.crm}</td>
                  <td className={styles.td}>{m.ativo ? 'Ativo' : 'Inativo'}</td>
                  <td className={styles.td}>
                    <button className={styles.btnDetails} onClick={() => { setSelected(m); setOpenDetail(true); }}>
                      Ver
                    </button>
                    <button className={styles.btnToggle} onClick={() => toggleAtivo(m)}>
                      {m.ativo ? 'Inativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className={styles.floatingBtn} onClick={() => setOpenNew(true)}>➕ Novo</button>

        {(openNew || openDetail) && (
          <ModalMedico
            medico={selected ?? { nome: '', crm: '', ativo: true }}
            onSalvar={salvarMedico}
            onCancelar={() => { setOpenDetail(false); setOpenNew(false); setSelected(null); }}
          />
        )}
      </main>
    </>
  );
}

function ModalMedico({ medico, onSalvar, onCancelar }: { medico: Partial<Medico>; onSalvar: (m: Partial<Medico>) => void; onCancelar: () => void }) {
  const [nome, setNome] = useState(medico.nome ?? '');
  const [crm, setCrm] = useState(medico.crm ?? '');
  const [ativo, setAtivo] = useState(medico.ativo ?? true);

  const salvar = () => {
    if (!nome.trim() || !crm.trim()) {
      alert('Preencha todos os campos.');
      return;
    }
    onSalvar({ ...medico, nome, crm, ativo });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{medico.id ? 'Editar Médico' : 'Novo Médico'}</h2>

        <label className={styles.modalLabel}>Nome</label>
        <input className={styles.modalInput} value={nome} onChange={e => setNome(e.target.value)} />

        <label className={styles.modalLabel}>CRM</label>
        <input className={styles.modalInput} value={crm} onChange={e => setCrm(e.target.value)} />

        <label className={styles.modalLabel}>Ativo</label>
        <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} />

        <div className={styles.modalButtons}>
          <button className={styles.buttonClose} onClick={onCancelar}>Cancelar</button>
          <button className={styles.buttonSubmit} onClick={salvar}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
