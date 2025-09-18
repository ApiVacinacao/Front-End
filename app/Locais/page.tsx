'use client';

import React, { useState, useEffect } from 'react';
import styles from './locais.module.css';
import modalStyles from './EditModal.module.css';
import Navbar from '../components/navbar/page';

interface Local {
  id: number;
  nome: string;
  endereco: string;
  telefone: string; // adicionado telefone
}

const API_URL = 'http://localhost:8000/api/localAtendimentos';

const Locais: React.FC = () => {
  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localEditando, setLocalEditando] = useState<Local | null>(null);

  // Fetch dos locais
  const fetchLocais = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Você não tem permissão para acessar essa informação.');
        } else {
          setError(`Erro ao carregar locais: ${res.status}`);
        }
        return;
      }

      const data = await res.json();
      setLocais(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  const editarLocal = (id: number) => {
    const local = locais.find(l => l.id === id);
    if (local) setLocalEditando(local);
  };

  const salvarEdicao = async (atualizado: Local) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${atualizado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(atualizado),
      });

      if (!res.ok) {
        alert('Erro ao salvar local.');
        return;
      }

      setLocais(prev => prev.map(l => l.id === atualizado.id ? atualizado : l));
      setLocalEditando(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localEditando) {
      setLocalEditando({ ...localEditando, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Lista de Locais</h1>
          <hr className={styles.divider} />

          {loading && <p>Carregando locais...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className={styles.lista}>
            {locais.map(local => (
              <div key={local.id} className={styles.item}>
                <div className={styles.info}>
                  <strong>{local.nome}</strong>
                  <p>Endereço: {local.endereco}</p>
                  <p>Telefone: {local.telefone}</p>
                </div>
                <div className={styles.botoes}>
                  <button className={styles.editButton} onClick={() => editarLocal(local.id)}>Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {localEditando && (
          <div className={modalStyles.modalOverlay}>
            <div className={modalStyles.modalContent}>
              <h2>Editar Local</h2>

              <label>Nome</label>
              <input type="text" name="nome" value={localEditando.nome} onChange={handleInputChange} />

              <label>Endereço</label>
              <input type="text" name="endereco" value={localEditando.endereco} onChange={handleInputChange} />

              <label>Telefone</label>
              <input type="text" name="telefone" value={localEditando.telefone} onChange={handleInputChange} />

              <div className={modalStyles.actions}>
                <button onClick={() => setLocalEditando(null)} className={modalStyles.cancelButton}>Cancelar</button>
                <button onClick={() => salvarEdicao(localEditando)} className={modalStyles.saveButton}>Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Locais;
